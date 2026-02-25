import { Text, View, SafeAreaView, FlatList } from "react-native";
import React, { use, useEffect } from "react";
import clsx from "clsx";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useLocalSearchParams, router } from "expo-router";
import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import { Category, MenuItem } from "@/type";
import SearchBar from "@/components/SearchBar";
import Filter from "@/components/Filter";

const search = () => {
  const { category, query, categoryName } = useLocalSearchParams<{
    category?: string;
    query?: string;
    categoryName?: string;
  }>();
  console.log("Search params:", { category, query });

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: {
      category: category || "",
      query: query || "",
      limit: 6,
    },
  });

  const { data: categories } = useAppwrite({
    fn: getCategories,
  });

  console.log("Search data:", data);

  // When arriving from home screen with a category name, resolve it to the
  // Appwrite $id so the query and filter chip both work correctly.
  useEffect(() => {
    if (categoryName && categories) {
      const found = (categories as unknown as Category[]).find((c) => c.name === categoryName);
      if (found) {
        router.setParams({ category: found.$id, categoryName: "" });
      }
    }
  }, [categoryName, categories]);

  useEffect(() => {
    refetch({
      category: category || "",
      query: query || "",
      limit: 6,
    });
  }, [category, query]);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View
              className={clsx(
                "flex-1 max-w-[48%]",
                !isFirstRightColItem ? "mt-10" : "mt-0",
              )}
            >
              <MenuCard item={item as MenuItem} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  Search
                </Text>
                <View className="flex-start flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-semibold text-dark-100">
                    Pick your Poison, Fattie
                  </Text>
                </View>
              </View>
              <CartButton />
            </View>
            <SearchBar />
            <Filter categories={categories!}/>
            {/* the exlamation mark is used here because categories can be undefined at first render and tells it that we are sure categories is not undefined */}
          </View>
        )}
        ListEmptyComponent={() => !loading && <Text>No results found</Text>}
      />
    </SafeAreaView>
  );
};

export default search;
