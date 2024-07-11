import React, { useCallback, useMemo } from 'react';

export interface ListItemProps {
    id: string;
    label: string;
    children?: ListItemProps[];
}

interface ListItemComponentProps {
    item: ListItemProps;
    selectedItems: Map<string, 'checked' | 'unchecked' | 'indeterminate'>;
    onCheckboxChange: (id: string, state: 'checked' | 'unchecked' | 'indeterminate') => void;
    onAddChildren: (id: string) => void;
}

const ListItem: React.FC<ListItemComponentProps> = ({ item, selectedItems, onCheckboxChange, onAddChildren }) => {
    const checkboxState = useMemo(() => selectedItems.get(item.id) || 'unchecked', [selectedItems, item.id]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = event.target.checked ? 'checked' : 'unchecked';
        onCheckboxChange(item.id, newState);
    }, [item.id, onCheckboxChange]);

    const handleAddChildrenClick = useCallback(() => {
        onAddChildren(item.id);
    }, [item.id, onAddChildren]);

    return (
        <div className="list-item">
            <input
                type="checkbox"
                checked={checkboxState === 'checked'}
                onChange={handleChange}
                ref={input => {
                    if (input) input.indeterminate = checkboxState === 'indeterminate';
                }}
            />
            <button onClick={handleAddChildrenClick}>Add Children</button>
            {item.label}
            {item.children && (
                <div className="children">
                    {item.children.map(child => (
                        <MemoizedListItem
                            key={child.id}
                            item={child}
                            selectedItems={selectedItems}
                            onCheckboxChange={onCheckboxChange}
                            onAddChildren={onAddChildren}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const MemoizedListItem = React.memo(ListItem);
export default MemoizedListItem;
