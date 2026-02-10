import {  Text, TouchableOpacity, Image, Platform } from 'react-native'
import { MenuItem } from '@/type'

const MenuCard = ({ item : { name, price, image_url }}: { item: MenuItem }) => {
  return (
    <TouchableOpacity className='menu-card' style={Platform.OS === 'android' ? { shadowColor: '#878787' , elevation: 10 } : {}} onPress={()=>{}} key={name}>
      <Image source={{ uri: image_url }} className='size-32 absolute -top-10' resizeMode='contain'/>
      <Text className='text-center base-bold text-dark-100 mb-2' numberOfLines={1}>{name}</Text>
      <Text className='body-regular text-gray-200 mb-4'>From ¥{price}</Text>
      <TouchableOpacity onPress={()=>{}}>
        <Text className='paragraph-bold text-primary'>Add to Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MenuCard