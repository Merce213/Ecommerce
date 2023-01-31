import React, { createContext, useContext, useState, useMemo } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addToCart = (product, quantity) => {
        const checkProductInCart = cartItems.find(
            (item) => item._id === product._id
        );

        setTotalPrice(
            (prevTotalPrice) => prevTotalPrice + product.price * quantity
        );
        setTotalQuantities(
            (prevTotalQuantities) => prevTotalQuantities + quantity
        );

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id)
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity,
                    };
                return cartProduct;
            });

            setCartItems(updatedCartItems);
            setQty(1);
        } else {
            product.quantity = quantity;

            setCartItems([...cartItems, { ...product }]);
            setQty(1);
        }
        toast.success(`${qty} ${product.name} added to the cart`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onRemove = (product) => {
        const updatedCartItems = cartItems.filter(
            (item) => item._id !== product._id
        );

        setCartItems(updatedCartItems);
        setTotalPrice(
            (prevTotalPrice) =>
                prevTotalPrice - product.price * product.quantity
        );
        setTotalQuantities(
            (prevTotalQuantities) => prevTotalQuantities - product.quantity
        );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = [...cartItems]; // for mutating the array in place

        if (value === "inc") {
            foundProduct.quantity += 1;
            newCartItems[index] = foundProduct; // prevents reordering
            setCartItems(newCartItems);
            setTotalPrice(
                (prevTotalPrice) => prevTotalPrice + foundProduct.price
            );
            setTotalQuantities(
                (prevTotalQuantities) => prevTotalQuantities + 1
            );
        } else if (value === "dec") {
            if (foundProduct.quantity > 1) {
                foundProduct.quantity -= 1;
                newCartItems[index] = foundProduct;
                setCartItems(newCartItems);
                setTotalPrice(
                    (prevTotalPrice) => prevTotalPrice - foundProduct.price
                );
                setTotalQuantities(
                    (prevTotalQuantities) => prevTotalQuantities - 1
                );
            }
        }
    };

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    };

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty === 1) {
                return prevQty;
            }
            return prevQty - 1;
        });
    };

    const store = useMemo(
        () => ({
            showCart,
            setShowCart,
            setCartItems,
            cartItems,
            totalPrice,
            setTotalPrice,
            totalQuantities,
            setTotalQuantities,
            qty,
            incQty,
            decQty,
            addToCart,
            toggleCartItemQuantity,
            onRemove,
        }),
        [
            addToCart,
            toggleCartItemQuantity,
            onRemove,
            cartItems,
            qty,
            showCart,
            totalPrice,
            totalQuantities,
        ]
    );

    return <Context.Provider value={store}>{children}</Context.Provider>;
};

export const useStateContext = () => useContext(Context);
