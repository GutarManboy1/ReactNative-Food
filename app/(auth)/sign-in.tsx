import { View, Text, Button, Alert } from "react-native";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { useState } from "react";
import { signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchAuthenticatedUser } = useAuthStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password)
      return Alert.alert("Error", "Please fill in all fields");

    setIsSubmitting(true);

    try {
      await signIn({
        email,
        password,
      });
      await fetchAuthenticatedUser();
      router.replace("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      Alert.alert("Error", error?.message || "Sign in failed");
      Sentry.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        label="Password"
        secureTextEntry={true}
      />

      <CustomButton title="Sign In" onPress={submit} isLoading={isSubmitting} />

      <View className="flex-center">
        <Text className="base-regular text-gray-100">
          Don't have an account?{" "}
        </Text>
        <Link href="/sign-up">
          <Text className="base-regular text-primary">Sign Up</Text>
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
