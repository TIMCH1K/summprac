import React, { useState, useCallback } from 'react';
import ListItem, { ListItemProps } from './ListItem';

const initialData: ListItemProps[] = [
    {
        id: '1',
        label: 'Item 1',
    },
    {
        id: '2',
        label: 'Item 2',
    },
];

const NestedList: React.FC = () => {
    const [data, setData] = useState<ListItemProps[]>(initialData);
    const [selectedItems, setSelectedItems] = useState<Map<string, 'checked' | 'unchecked' | 'indeterminate'>>(new Map());

    const updateChildrenSelection = useCallback((items: ListItemProps[], state: 'checked' | 'unchecked') => {
        const update = (items: ListItemProps[]) => {
            items.forEach(item => {
                setSelectedItems(prev => {
                    const newSelectedItems = new Map(prev);
                    newSelectedItems.set(item.id, state);
                    return newSelectedItems;
                });
                if (item.children) {
                    update(item.children);
                }
            });
        };
        update(items);
    }, []);

    const handleCheckboxChange = useCallback((id: string, state: 'checked' | 'unchecked' | 'indeterminate') => {
        setSelectedItems(prev => {
            const newSelectedItems = new Map(prev);
            newSelectedItems.set(id, state);
            return newSelectedItems;
        });

        if (state === 'checked' || state === 'unchecked') {
            setData(prevData => {
                const updateData = (items: ListItemProps[]): ListItemProps[] => {
                    return items.map(item => {
                        if (item.id === id && item.children) {
                            updateChildrenSelection(item.children, state);
                        }
                        if (item.children) {
                            item.children = updateData(item.children);
                        }
                        return item;
                    });
                };
                return updateData([...prevData]);
            });
        }
    }, [updateChildrenSelection]);

    const handleAddChildren = useCallback((id: string) => {
        setData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const addChildren = (items: ListItemProps[]): ListItemProps[] => {
                return items.map(item => {
                    if (item.id === id) {
                        item.children = item.children || [];
                        item.children.push(
                            { id: `${id}-${item.children.length + 1}`, label: `Item ${id}-${item.children.length + 1}` },
                            { id: `${id}-${item.children.length + 2}`, label: `Item ${id}-${item.children.length + 2}` },
                            { id: `${id}-${item.children.length + 3}`, label: `Item ${id}-${item.children.length + 3}` },
                            { id: `${id}-new`, label: `Item ${id}-new`, children: [] }
                        );
                    }
                    if (item.children) {
                        item.children = addChildren(item.children);
                    }
                    return item;
                });
            };
            return addChildren(newData);
        });
    }, []);

    return (
        <div className="container">
            {data.map(item => (
                <ListItem
                    key={item.id}
                    item={item}
                    selectedItems={selectedItems}
                    onCheckboxChange={handleCheckboxChange}
                    onAddChildren={handleAddChildren}
                />
            ))}
        </div>
    );
};

export default NestedList;
