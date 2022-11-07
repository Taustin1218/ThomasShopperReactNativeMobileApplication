import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import Item from '../../components/Item';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
// import openDatabase hook
import { openDatabase } from "react-native-sqlite-storage";

// use hook
const shopperDB = openDatabase({name: 'Shopper.db'});
const itemTableName = 'Items';

const AddListItemScreen = props => {

  const post = props.route.params.post;

  const navigation = useNavigation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      // declare an empty array that will sstore the results of the
      // SELECT
      let results = [];
      // declare a transaction that will execute the SELECT
      shopperDB.transaction(txn => {
        // execute SELECT
        txn.executeSql(
          `SELECT * FROM ${itemTableName}`,
          [],
          // callback fucntion to handle the results from the
          // SELECT
          (_, res) => {
            // get number of rows of data selected
            let len = res.rows.length;
            console.log('Length of items ' + len);
            // if more than one row was returned
            if (len > 0){
              // loop through the rows
              for (let i = 0; i < len; i++){
                // push a row of data at a time onto the
                // results array
                let item = res.rows.item(i);
                results.push({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  list_id: post.id,
                });
              }
              // assign results array to lists state variable
              setItems(results);
              /* [
              //   {
              //      id: 1
                      name: Eggs
                      price: 3.99
                      quantity: 1
                      list_id: 1
              },
              {
                      id: 2
                      name: Bread
                      price: 4.99
                      quantity: 1
                      list_id: 1
              },
              {
                      id: 3
                      name: Milk
                      price: 5.99
                      quantity: 1
                      list_id: 1
              },
              {
                      id: 4
                      name: Necklace
                      price: 25.99
                      quantity: 1
                      list_id: 2
              },
              //   }
              // ] */
            } else {
              // if no rows of data were returned,
              // set items state variable to an empty array
              setItems([]);
            }
          },
          error => {
            console.log('Error getting items ' + error.mesage);
          },
        )
      }); 
   });
   return listener;
  });

  return (
    <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={({item}) => <Item post={item} />}
          keyExtractor={item => item.id}/>
    </View>
  );
};

export default AddListItemScreen; 