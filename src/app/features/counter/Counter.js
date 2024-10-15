import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./counterSlice";
import { Text, TouchableOpacity, View } from "react-native";
import { selectUser } from "../../userSlice";

export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const user = useSelector(selectUser); // Get the global user state
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{count}</Text>

      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onPress={() => dispatch(increment())}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Increment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 10,
          borderRadius: 5,
        }}
        onPress={() => dispatch(decrement())}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Decrement</Text>
      </TouchableOpacity>
    </View>
  );
}
