import React from 'react';
import { NavigateFunction } from 'react-router-dom';

interface ButtonAction<T> {
    label: string | ((item: T) => string);
    onClick: (item: T, navigate: NavigateFunction, e: React.MouseEvent) => void;
    className?: string;
    disabled?: (item: T) => boolean;
}

interface ActionButtonsProps<T> {
    item: T;
    navigate: NavigateFunction;
    actions: ButtonAction<T>[];
}

const ActionButtons = <T extends object>({ item, navigate, actions }: ActionButtonsProps<T>) => {
    return (
        <div className="btns-line">
            {actions.map((action, index) => (
                <button
                    key={index}
                    className={action.className || 'action-btn'}
                    onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(item, navigate, e);
                    }}
                    disabled = {typeof action.disabled === 'function' ? action.disabled(item) : action.disabled}
                >
                    {typeof action.label === 'function' ? action.label(item) : action.label}
                </button>
            ))}
        </div>
    );
};

export default ActionButtons;
