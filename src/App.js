import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listRestaurants } from "./graphql/queries";
import {
  createRestaurant,
  deleteRestaurant,
} from "./graphql/mutations";

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listRestaurants });
    const notesFromAPI = apiData.data.listRestaurants.items;
    setNotes(notesFromAPI);
  }

  async function createRestaurantNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      city: form.get("city"),
    };
    await API.graphql({
      query: createRestaurant,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteRestaurantNote({ id }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await API.graphql({
      query: deleteRestaurant,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Flex className="Logo" display="flex" justifyContent="space-around" margin-top="3rem">
      <Heading level={1}>My Yelp</Heading>
      <Button onClick={signOut}>Sign Out</Button>
      </Flex>
      <View as="form" margin="3rem 0" onSubmit={createRestaurantNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="city"
            placeholder="restourant City"
            label="restourant City"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Restourant
          </Button>
        </Flex>
      
        <Heading level={2} style={{"margin-top":"2rem"}}>Current Notes</Heading>
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Descripton</th>
            <th>City</th>
            <th>Processing</th>
          </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
             
              <tr>
                <td as="strong" fontWeight={700}>{note.name}</td>
                <td as="span">{note.description}</td>
                <td as="span">{note.city}</td>
                <td><Button variation="link" onClick={() => deleteRestaurantNote(note)}>
                  Delete note
                </Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </View>
    </View>
  );
};

export default withAuthenticator(App);