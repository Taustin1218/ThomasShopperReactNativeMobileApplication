import React, { useState } from 'react';
import {Text, TextInput, View, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
// import openDtabase hook
import { openDatabase } from "react-native-sqlite-storage";

// use hook
const shopperDB = openDatabase({name: 'Shopper.db'});
const listTableName = 'Lists';

const ExistingListScreen = props => {

    const post = props.route.params.post;

    const [name, setName] = useState(post.name);
    const [store, setStore] = useState(post.store);
    const [date, setDate] = useState(post.date);

    const navigation = useNavigation();

    const onListUpdate = () => {
        if (!name){
            alert('Please enter a shopping list name.');
            return;
        }
        if (!store){
            alert('Please enter a store.');
            return;
        }
        if (!date){
            alert('Please enter a date in format YYYY-MM-DD.');
            return;
        }

        shopperDB.transaction(txn => {
            txn.executeSql(
                `UPDATE ${listTableName} SET name = '${name}', store = '${store}', '${date}' WHERE id = ${post.id}`,
                [],
                () => {
                    console.log(`${name} updated successfully`);
                },
                error => {
                    console.log('Error on updating list' + error.message);
                }
            );
        });

        alert(name + ' updated!');
        navigation.navigate('Start Shopping!');
    }

    const onListDelete = () => {
        
    }

    const onAddItem = () => {
        
    }

    const onViewList = () => {
        
    }

  return (
    <View style={styles.container}>
        <View style={styles.topContainer}>
            <TextInput 
                value={name}
                onChangeText={value => setName(value)}
                style={styles.name}
                clearBottunMode={'while-editing'}
                placeholder={'Enter List Name'}
                placeholderTextColor={'grey'}
            />
            <TextInput 
                value={store}
                onChangeText={value => setStore(value)}
                style={styles.store}
                clearBottunMode={'while-editing'}
                placeholder={'Enter Store'}
                placeholderTextColor={'grey'}
            />
            <TextInput 
                value={date}
                onChangeText={value => setDate(value)}
                style={styles.date}
                clearBottunMode={'while-editing'}
                placeholder={'Enter Date in format YYYY-MM-DD'}
                placeholderTextColor={'grey'}
            />
        </View>
        <View style={styles.bottomContainer}>
            <Pressable style={styles.updateButton} onPress={onListUpdate}>
                <Text style={styles.buttonText}>Update</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onListDelete}>
                <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
            <Pressable style={styles.addButton} onPress={onAddItem}>
                <Text style={styles.buttonText}>Add Item</Text>
            </Pressable>
            <Pressable style={styles.viewButton} onPress={onViewList}>
                <Text style={styles.buttonText}>View Items</Text>
            </Pressable>
        </View>
    </View>
  );
};

export default ExistingListScreen;