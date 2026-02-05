import { View, Text, SafeAreaView, Button, Button } from 'react-native'
import React from 'react'
import seed from '@/lib/seed'

const search = () => {
  return (
    <SafeAreaView>
      <Text>search</Text>

      <Button title="Seed" onPress={() => seed().catch(error => console.error('Failed to seed the database'))} />
    </SafeAreaView>
  )
}

export default search