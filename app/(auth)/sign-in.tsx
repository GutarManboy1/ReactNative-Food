import { View, Text, Button } from 'react-native'
import { router } from 'expo-router'

const SignIn = () => {
  return (
    <View>
      <Text>sign-in</Text>
      {/* a simple button such as this one and i can use this. but if i wanted something more complex i should use TouchableOpacity */}
      <Button title="Sign Up" onPress={() => router.push('/sign-up')} />
    </View>
  )
}

export default SignIn