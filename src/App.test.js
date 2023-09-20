import {
  render, screen, waitFor, act,
} from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Items from './components/calcItems';
import Calculator from './components/Calculator';
import CalculatorNew from './components/CalculatorNew';
import Home from './components/Home';
import Navbar from './components/Navbar';
import QuotePage from './components/Quote';
import Quotes from './components/Quotes';
import calculate from './logic/calculate';
import operate from './logic/operate';

describe('tests math-magician App test', () => {
  test('renders the Items component', () => {
    const handleClick = jest.fn();
    const number = 8;

    const componentTree = renderer.create(
      <Items number={number} handleClick={handleClick} />,
    );

    expect(componentTree.toJSON()).toMatchSnapshot();
  });

  test('should render the component', () => {
    const component = renderer.create(<Calculator />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render the navbar and calculator page correctly', () => {
    render(
      <BrowserRouter>
        <CalculatorNew />
      </BrowserRouter>,
    );
    const navbar = screen.getByText('Math Magicians');
    expect(navbar).toBeInTheDocument();
    const calculator = screen.getByRole('main');
    expect(calculator).toBeInTheDocument();
  });

  test('should render the welcome message', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const welcomeMessage = screen.getByText(/Welcome to Math World!/i);
    expect(welcomeMessage).toBeInTheDocument();

    expect(welcomeMessage).toMatchSnapshot();
  });

  test('should render the paragraph text', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const paragraphText = screen.getByText(/Lorem ipsum dolor sit amet/i);
    expect(paragraphText).toBeInTheDocument();

    expect(paragraphText).toMatchSnapshot();
  });

  test('renders the Navbar component', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const headerText = screen.getByText(/Math Magicians/i);
    expect(headerText).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();

    const calculatorLink = screen.getByRole('link', { name: /Calculator/i });
    expect(calculatorLink).toBeInTheDocument();

    const quoteLink = screen.getByRole('link', { name: /Quote/i });
    expect(quoteLink).toBeInTheDocument();

    const navbarComponent = screen.getByRole('navigation');
    expect(navbarComponent).toMatchSnapshot();
  });

  test('renders the QuotePage component', () => {
    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>,
    );

    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument();

    const quotesElement = screen.getByRole('main');
    expect(quotesElement).toBeInTheDocument();

    const componentTree = renderer.create(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>,
    );
    expect(componentTree.toJSON()).toMatchSnapshot();
  });

  const waitForFetch = (data) => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(data),
    }));
  };

  test('shows charging status while getting data', async () => {
    waitForFetch([]);

    render(<Quotes />);

    const loadingElement = await screen.findByText(/Quote is loading/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('show citations and authors after getting the data', async () => {
    waitForFetch([
      {
        id: 1,
        quote: 'Cita de ejemplo',
        author: 'Autor de ejemplo',
      },
    ]);

    await act(async () => {
      render(<Quotes />);
    });

    await waitFor(() => {
      const quoteElement = screen.getByText('Cita de ejemplo');
      const authorElement = screen.getByText('Autor de ejemplo');
      expect(quoteElement).toBeInTheDocument();
      expect(authorElement).toBeInTheDocument();
    });
  });

  test('matches the snapshot', () => {
    const componentTree = renderer.create(<Quotes />);
    expect(componentTree.toJSON()).toMatchSnapshot();
  });

  test('returns updated object with AC', () => {
    const res = calculate({ total: '8', next: '9', operation: '-' }, 'AC');
    expect(res).toEqual({ total: null, next: null, operation: null });
  });

  test('update object with decimal', () => {
    const res = calculate({ total: '8', next: null, operation: null }, '.');
    expect(res).toEqual({ total: '8', next: '8.', operation: null });
  });

  test('simple operation with =', () => {
    const res = calculate({ total: '8', next: '2', operation: 'x' }, '=');
    expect(res).toEqual({ total: '16', next: null, operation: null });
  });

  test('simple operation with =', () => {
    const res = calculate({ total: '8', next: '2', operation: '÷' }, '=');
    expect(res).toEqual({ total: '4', next: null, operation: null });
  });

  test('change sign', () => {
    const res = calculate({ total: '8', next: null, operation: null }, '+/-');
    expect(res).toEqual({ total: '-8', next: null, operation: null });
  });

  test('change sign next', () => {
    const res = calculate({ total: '8', next: '3', operation: '+' }, '+/-');
    expect(res).toEqual({ total: '8', next: '-3', operation: '+' });
  });

  test('should add two numbers correctly', () => {
    const res = operate(9, 3, '+');
    expect(res).toEqual('12');
  });
});

describe('operate', () => {
  test('should substract two numbers correctly', () => {
    const res = operate(9, 3, '-');
    expect(res).toEqual('6');
  });
});

describe('operate', () => {
  test('should multiply two numbers correctly', () => {
    const res = operate(9, 3, 'x');
    expect(res).toEqual('27');
  });
});

describe('operate', () => {
  test('should divide two numbers correctly', () => {
    const res = operate(9, 3, '÷');
    expect(res).toEqual('3');
  });
});

describe('operate', () => {
  test('should calculate modulus of the number correctly', () => {
    const res = operate(9, 3, '%');
    expect(res).toEqual('0');
  });
});
