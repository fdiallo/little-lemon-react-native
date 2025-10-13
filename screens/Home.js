import * as React from 'react'
import {
    View, StyleSheet, Text, TextInput,
    Pressable, KeyboardAvoidingView, TouchableOpacity,
    ScrollView, Platform, Image, ActivityIndicator, Button, SectionList, FlatList,
} from 'react-native';
import { useState, useEffect, useMemo, useCallback, } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import CircleButton from './CircleButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import Filters from '../components/Filters';
import { useNavigation } from '@react-navigation/native';
import {
    createTable,
    getMenuItems,
    saveMenuItems,
    filterByQueryAndCategories,
    initializeDB,
} from '../database';
import { getSectionListData, useUpdateEffect } from '../utils';
import { ImageStore } from 'react-native';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const imageUrl = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';
const sections = ['starters', 'mains', 'desserts', 'drinks'];
  

export default function Home() {

    //const [profileImage, setProfileImage] = useState(null);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    );
    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            const jsonValue = await response.json();
            console.log("API Response: ", jsonValue.menu);
            return jsonValue.menu;
        } catch (error) {
            console.log('Error fetching data...', error);
        }
        return [];
    };

    useEffect(() => {
        (async () => {
            //console.log('Use Effect...');
            //console.log(`${imageUrl}${imagestring}?raw=true`);
            try {
                await initializeDB();
                await createTable();
                let menuItems = await getMenuItems();
                //console.log('MenuItems: ', menuItems);

                // The application only fetches the menu data once from a remote URL
                // and then stores it into a SQLite database.
                // After that, every application restart loads the menu from the database

                if (!menuItems.length) {
                    const menuItems = await fetchData();
                    //console.log('Data Fetched: ', menuItems);
                    saveMenuItems(menuItems);
                }
                const sectionListData = getSectionListData(menuItems);
                //console.log('SectionListData: ', sectionListData);
                setData(sectionListData);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, []);

useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);

    };

    const Item = ({ name, price, description, image }) => (
        <View style={styles.sectionList}>
            <View style={styles.itemContent}>
                <View style={styles.columnText}>
                    <Text style={styles.itemPriceAndNameRow}>{name}</Text>
                    <Text style={styles.itemDesc}>{description}</Text>
                    <Text style={styles.itemPriceAndNameRow}>{price}</Text>
                </View>
                <Image style={styles.menuImage} source={{ uri: `${imageUrl}${image}?raw=true` }} />
            </View>
        </View>
    );

    function capitalizeFirstLetter(string) {
        if (!string) {
            return "";
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const Separator = () => <View style={styles.sectionLineSeparator}></View>;


    return (

        <View style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.containerHeader}>
                <Text></Text>
                <Image
                    resizeMode='contain'
                    style={styles.imgLogo}
                    source={require('../img/little_lemon_logo.png')} />
                <Pressable onPress={() => navigation.navigate('Profile')}>
                    <Image
                        resizeMode='contain'
                        style={styles.imgProfile}
                        source={require('../img/profile.png')} />
                </Pressable>
            </View>
            <View style={styles.banner}>
                <Text style={styles.titleText}>Let us get to know you</Text>
                <View style={styles.bodyRow}>
                    <View style={styles.columnText}>
                        <Text style={styles.subTitleText}>Chicago</Text>
                        <Text style={styles.bodyText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    </View>
                    <Image
                        resizeMode='wrap'
                        style={styles.imgBody} source={require('../img/heroimage.png')} />
                </View>

                <Searchbar
                    placeholder="Search"
                    placeholderTextColor="black"
                    onChangeText={handleSearchChange}
                    value={searchBarText}
                    style={styles.searchBar}
                    iconColor="black"
                    inputStyle={{ color: 'black' }}
                    elevation={0}
                />

            </View>
            <Text style={styles.orderForDelivery}>ORDER FOR DELIVERY!</Text>

            <Filters
                selections={filterSelections}
                onChange={handleFiltersChange}
                sections={sections}
            />

            <SectionList
                style={styles.sectionList}
                sections={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Item name={item.name} price={item.price} description={item.description} image={item.image} />
                )}
                renderSectionHeader={({ section: { category } }) => (
                    <Text style={styles.sectionHeader}>{capitalizeFirstLetter(category)}</Text>
                )}
                ItemSeparatorComponent={Separator}
            />

        </View >

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 2,

    },
    imgLogo: {
        height: 100,
        width: 220,

    },
    imgProfile: {
        height: 60,
        width: 60,
        borderRadius: 30,

    },
    banner: {
        backgroundColor: '#495E57',
        paddingHorizontal: 16,
    },
    titleText: {
        fontSize: 32,
        color: '#F4CE14',
        paddingTop: 16,
    },
    subTitleText: {
        fontSize: 24,
        color: '#FFFFFF',
        paddingBottom: 16,
    },
    bodyRow: {
        flexDirection: 'row',
        marginVertical: 16,
    },
    columnText: {
        flexShrink: 1,
    },
    bodyText: {
        fontSize: 16,
        color: '#FFFFFF',

    },
    imgBody: {
        width: 150,
        height: 150,
        borderRadius: 8,
    },

    img: {
        width: 60,
        height: 60,
        marginRight: 24,
        borderRadius: 30,
    },
    searchBar: {
        marginBottom: 16,
        backgroundColor: '#FFFFFFFF',
        shadowRadius: 0,
        shadowOpacity: 0,
    },

    orderForDelivery: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        alignItems: 'center',

    },
    sectionList: {
        paddingLeft: 8,

    },

    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    itemPriceAndNameRow: {
        flexDirection: 'row',
        paddingRight: 8,
        fontWeight: 'bold',
        fontSize: 16,

    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemPrice: {

        fontWeight: 'bold',
        fontSize: 16,
    },
    itemDesc: {
        fontSize: 14,
        paddingRight: 8,
    },
    menuImage: {
        height: 100,
        width: 100,
        marginRight: 8,
    },
    sectionHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#495E57',
        textAlign: 'center',
    },
    sectionLineSeparator: {
        height: 1,
        backgroundColor: '#495E57',
        marginVertical: 8,
    },




    contentContainer: {
        paddingTop: 2,
        paddingHorizontal: 16,
    },
    persoInfo: {
        fontSize: 24,
        paddingBottom: 8,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        paddingBottom: 2,
        paddingTop: 4,
    },



});