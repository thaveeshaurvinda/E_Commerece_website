import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import './globals.css'; // Or your custom global CSS file path

export const metadata = {
  title: 'URBAN FIT',
  description: 'Premium Streetwear & Fitness Apparel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}