import { View, Text, Button, Alert } from "react-native";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { useState } from "react";
import { createUser } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchAuthenticatedUser } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password)
      return Alert.alert("Error", "Please fill in all fields");

    setIsSubmitting(true);

    try {
      await createUser({
        email,
        password,
        name,
      });

      await fetchAuthenticatedUser();
      Alert.alert("Success", "Signed Up successfully");
      router.replace("/");
    } catch (error: any) {
      console.error("Sign up error:", error);
      Alert.alert("Error", error?.message || "Sign Up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        label="Name"
      />
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

      <CustomButton title="Sign Up" onPress={submit} isLoading={isSubmitting} />

      <View className="flex-center">
        <Text className="base-regular text-gray-100">
          Already have an account?{" "}
        </Text>
        <Link href="/sign-in">
          <Text className="base-regular text-primary">Sign In</Text>
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
