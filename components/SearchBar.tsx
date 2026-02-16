import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { images } from "@/constants";
// import { useDebouncedCallback } from "use-debounce"
const SearchBar = () => {
  const params = useLocalSearchParams<{ query: string }>();
  const [query, setQuery] = useState(params.query);

  // this is super important to debounce the search input to avoid making too many requests while the user is typing. The `useDebouncedCallback` hook from the `use-debounce` library allows us to create a debounced version of our search function.
  // const debounceSearch = useDebouncedCallback(
  //   (text: string) => {
  //     setQuery(text);
      // this router push method is used to navigate to the search results page with the updated query parameter. This way, when the user types in the search bar, it will update the URL and trigger a new search without making too many requests. debouced is great but the keyboard disappears when the user types, so we can just log the search query for now and handle the navigation in a different way if needed.
  //     router.push(`/search?query=${text}`);
  //   },
  //   600 // Adjust the debounce delay as needed
  // );

  const handleSearch = (text: string) => {
    setQuery(text);

    if(!text) router.setParams({ query: undefined });
   
    // debounceSearch(text);
    // You can also update the URL query parameters here if needed
  };

  const handleSubmit = () => {
   if (query.trim()) router.setParams({ query: query.trim() });// Remove leading/trailing spaces();
    
  };
  return (
    <View className="searchbar">
      <TextInput
        placeholder="Search for your favorite dishes..."
        className="flex-1 p-5"
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        //  submits after hitting submit
        placeholderTextColor="#a0a0a0"
        returnKeyType="search"
      />
      <TouchableOpacity
        className="pr-5"
        onPress={() => router.setParams({ query: query.trim() })}
      >
        <Image
          source={images.search}
          className="size-6"
          resizeMode="contain"
          tintColor="#a0a0a0"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar; 
