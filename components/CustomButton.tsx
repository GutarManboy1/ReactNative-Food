import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { CustomButtonProps } from "@/type";
import { clsx } from "clsx";

const CustomButton = ({
  onPress,
  title,
  style,
  leftIcon,
  textStyle,
  isLoading = false,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity className={clsx("custom-btn", style)} onPress={onPress}>
      {leftIcon}
      <View className="flex-center flex-row">
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ): (
          <Text className={clsx( 'text-white 100 paragraph-semibold', textStyle )}>
            {title}
          </Text>
        )}
      </View>
     
    </TouchableOpacity>
  );
}
export default CustomButton;
