import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/services/supabaseClient";

export default function LoginScreen() {
  const router = useRouter();

  const [step, setStep] = useState<"mobile" | "otp" | "name">("mobile");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // SEND OTP
  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      Alert.alert("Error", "Please enter a valid mobile number");
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    Alert.alert("OTP Sent", `Your OTP is: ${randomOtp}`);

    setStep("otp");
  };

  // VERIFY OTP + CHECK USER
  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp) {
      Alert.alert("Invalid OTP", "Please try again.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("mobile", mobile)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // ⭐ SAVE USER MOBILE FOR FUTURE LOGIN
        await AsyncStorage.setItem("userMobile", mobile);

        Alert.alert("Success", "Login successful!");
        router.replace("/(tabs)");
      } else {
        setStep("name");
      }
    } catch (error) {
      console.log("Verify OTP Error:", error);
      Alert.alert("Error", "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // CREATE ACCOUNT
  const handleCreateAccount = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("users").insert([
        {
          name: name,
          mobile: mobile,
        },
      ]);

      if (error) throw error;

      const prevMobile = await AsyncStorage.getItem("userMobile");

      if (prevMobile && prevMobile !== mobile) {
        await AsyncStorage.removeItem("cart");
        await AsyncStorage.removeItem("appliedCoupon");
        await AsyncStorage.removeItem("dineinBooking");
        await AsyncStorage.removeItem("preOrderItems");
      }

      // ⭐ SAVE USER MOBILE FOR FUTURE LOGIN
      await AsyncStorage.setItem("userMobile", mobile);

      Alert.alert("Account Created", "Welcome!");
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Signup Error:", error);
      Alert.alert("Error", "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Text style={styles.emoji}>🍴</Text>
        <Text style={styles.title}>Moti Mahal</Text>
        <Text style={styles.subText}>Authentic North Indian Cuisine</Text>
      </View>

      {/* MOBILE STEP */}
      {step === "mobile" && (
        <View style={styles.box}>
          <Text style={styles.heading}>Welcome!</Text>
          <Text style={styles.subHeading}>Enter your mobile number</Text>

          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            keyboardType="number-pad"
            maxLength={10}
            value={mobile}
            onChangeText={(v) => setMobile(v.replace(/\D/g, ""))}
          />

          <TouchableOpacity
            style={[
              styles.button,
              mobile.length !== 10 && { backgroundColor: "#ccc" },
            ]}
            disabled={mobile.length !== 10}
            onPress={handleSendOtp}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* OTP STEP */}
      {step === "otp" && (
        <View style={styles.box}>
          <Text style={styles.heading}>Verify OTP</Text>
          <Text style={styles.subHeading}>Code sent to {mobile}</Text>

          <TextInput
            style={[styles.input, { letterSpacing: 8, fontSize: 22 }]}
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={(v) => setOtp(v.replace(/\D/g, ""))}
          />

          <TouchableOpacity
            style={[
              styles.button,
              otp.length !== 6 && { backgroundColor: "#ccc" },
            ]}
            disabled={otp.length !== 6}
            onPress={handleVerifyOtp}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep("mobile")}>
            <Text style={styles.link}>Change mobile number</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* NAME STEP */}
      {step === "name" && (
        <View style={styles.box}>
          <Text style={styles.heading}>Welcome! 👋</Text>
          <Text style={styles.subHeading}>Tell us your name</Text>

          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity
            style={[styles.button, !name.trim() && { backgroundColor: "#ccc" }]}
            disabled={!name.trim()}
            onPress={handleCreateAccount}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Get Started"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.terms}>
        By continuing, you agree to our Terms & Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
    backgroundColor: "#ffeede",
  },
  emoji: { fontSize: 60 },
  title: { fontSize: 28, fontWeight: "700", color: "#222" },
  subText: { color: "#666" },
  box: { width: "100%", marginBottom: 30 },
  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#222",
  },
  subHeading: { textAlign: "center", color: "#666", marginBottom: 20 },
  input: {
    borderWidth: 2,
    borderColor: "#ddd",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#FF5733",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
  link: { textAlign: "center", marginTop: 12, color: "#FF5733", fontSize: 14 },
  terms: { textAlign: "center", fontSize: 12, color: "#777" },
});
