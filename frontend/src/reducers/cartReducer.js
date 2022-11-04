import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  EMPTY_CART,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstant";

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const isItemExists = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExists) {
        // item found on cart
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExists.product ? item : i
          ),
        };
      } else {
        // item not in cart
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };

    case EMPTY_CART:
      return {
        ...state,
        cartItems: [],
      };
    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};
