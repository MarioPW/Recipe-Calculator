import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CustomModal } from './CustomModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
}));

const renderModal = (props = {}) =>
  render(
    <CustomModal title="Test title" onClose={vi.fn()} {...props}>
      <p>Modal body</p>
    </CustomModal>
  );

describe('CustomModal', () => {
  it('renders title, body and dialog a11y attributes', () => {
    renderModal({ id: 'test-modal' });

    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Test title');

    expect(dialog).toHaveAttribute('id', 'test-modal');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('renders header actions and footer', () => {
    renderModal({
      headerActions: <span>Header action</span>,
      footer: <button type="button">Footer action</button>
    });

    expect(screen.getByText('Header action')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Footer action' })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByRole('button', { name: 'common.close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on backdrop click and not on inner click', () => {
    const onClose = vi.fn();
    renderModal({ id: 'backdrop-modal', onClose });

    fireEvent.click(screen.getByText('Modal body'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores backdrop clicks when closeOnBackdrop is false', () => {
    const onClose = vi.fn();
    renderModal({ closeOnBackdrop: false, onClose });

    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not render body or footer containers when empty', () => {
    const { container } = render(<CustomModal title="Empty" onClose={vi.fn()} />);

    expect(container.querySelector('.modal-body')).not.toBeInTheDocument();
    expect(container.querySelector('.modal-footer')).not.toBeInTheDocument();
  });
});
