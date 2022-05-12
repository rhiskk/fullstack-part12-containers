import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Todo from './Todo';

describe('<Todo />', () => {
    const mockDelete = jest.fn();
    const mockComplete = jest.fn();
    beforeEach(() => {
        const todo = {
            text: 'Component testing is done with react-testing-library',
            done: false
        };
        render(<Todo todo={todo} onClickDelete={mockDelete} onClickComplete={mockComplete} />);
    });

    test('renders content', () => {
        const element = screen.getByText('Component testing is done with react-testing-library');
        expect(element).toBeDefined();
    });

    test('clicking the button calls event handler once', async () => {
        const user = userEvent.setup();
        const button = screen.getByText('Set as done');
        await user.click(button);
        expect(mockComplete.mock.calls).toHaveLength(1);
    });

});