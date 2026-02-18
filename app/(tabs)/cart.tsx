import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart.store";
import CustomHeader from "@/components/CustomHeader";
import clsx from "clsx";
import { PaymentInfoStripeProps } from "@/type";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";

// this component is responsible for displaying the contents of the shopping cart, including the items added by the user and a payment summary. It uses the `useCartStore` hook to access the cart state and calculate totals. The `PaymentInfoStripe` component is a reusable UI element for displaying individual pieces of payment information in a consistent format. this is only used here hence why it is defined in the same file, but it can be easily extracted to a separate file if needed in the future.
const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between flex-row my-1">
    <Text className={clsx("paragraph-medium text-gray-200", labelStyle)}>
      {label}
    </Text>
    <Text className={clsx("paragraph-bold text-dark-100", valueStyle)}>
      {value}
    </Text>
  </View>
);

const cart = () => {
  const { items, getTotalItems, getTotalPrice } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Trough" />}
        ListEmptyComponent={() => <Text>Empty Cart</Text>}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  {" "}
                  Payment Summary
                </Text>
                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`$${totalPrice.toFixed(2)}`}
                />
                 <PaymentInfoStripe
                  label={`Delivery Fee`}
                  value={`¥500`}
                />
                 <PaymentInfoStripe
                  label={`Discount`}
                  value={`¥100`}
                  valueStyle="!text-success"
                />
                <View className="border-t border-gray-300 my-2"/>
                 <PaymentInfoStripe
                  label={`Total`}
                  value={`$${(totalPrice + 500 - 100).toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>
              <CustomButton title="Buy Slime Trough" />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default cart;
