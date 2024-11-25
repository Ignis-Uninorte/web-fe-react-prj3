
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButtons from '../pages/components/actionButtons';
import { NavigateFunction } from 'react-router-dom';

describe('ActionButtons Component', () => {
  const mockNavigate = jest.fn() as unknown as NavigateFunction;

  const mockItem = {
    id: 1,
    name: 'Test Item',
  };

  const mockActions = [
    {
      label: 'Edit',
      onClick: jest.fn(),
      className: 'edit-btn',
    },
    {
      label: 'Delete',
      onClick: jest.fn(),
      disabled: () => true,
    },
    {
      label: (item: typeof mockItem) => `View ${item.name}`,
      onClick: jest.fn(),
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct number of buttons with appropriate labels', () => {
    render(<ActionButtons item={mockItem} navigate={mockNavigate} actions={mockActions} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockActions.length);

    expect(buttons[0]).toHaveTextContent('Edit');
    expect(buttons[1]).toHaveTextContent('Delete');
    expect(buttons[2]).toHaveTextContent(`View ${mockItem.name}`);
  });

  it('calls the onClick handler when a button is clicked', () => {
    render(<ActionButtons item={mockItem} navigate={mockNavigate} actions={mockActions} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockActions[0].onClick).toHaveBeenCalledWith(mockItem, mockNavigate, expect.any(Object));
    expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when the disabled function returns true', () => {
    render(<ActionButtons item={mockItem} navigate={mockNavigate} actions={mockActions} />);

    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeDisabled();
  });

  it('renders dynamic labels based on the item', () => {
    render(<ActionButtons item={mockItem} navigate={mockNavigate} actions={mockActions} />);

    const viewButton = screen.getByText(`View ${mockItem.name}`);
    expect(viewButton).toBeInTheDocument();
  });

  it('does not call onClick handler for disabled buttons', () => {
    render(<ActionButtons item={mockItem} navigate={mockNavigate} actions={mockActions} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockActions[1].onClick).not.toHaveBeenCalled();
  });
});
