import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { addKittyCreator, removeKittyCreator, selectAllKittyCreators } from './kittyCreatorSlice';

const Address = styled.div`
  padding: 0.25rem;
`;

export default function AdminPage() {
  const dispatch = useDispatch();
  const kittyCreators = useSelector(selectAllKittyCreators);
  const [newCreator, setNewCreator] = useState('');

  const onRemoveCreatorClicked = (address) => {
    dispatch(removeKittyCreator(address));
  };

  const kittyCreatorItems = kittyCreators.map((c) => (
    <Address key={c}>
      {c}
      <Button
        variant="danger"
        size="sm"
        className="ml-auto"
        onClick={() => onRemoveCreatorClicked(c)}
      >
        X
      </Button>
    </Address>
  ));

  const onCreatorChanged = (e) => setNewCreator(e.target.value);

  const onAddCreatorClicked = (event) => {
    event.preventDefault();
    dispatch(addKittyCreator(newCreator));
  };

  return (
    <div>
      <h1>Kitty Admin</h1>
      <h3>Kitty Creators</h3>
      <div>
        {kittyCreatorItems}
      </div>
      <Form inline onSubmit={onAddCreatorClicked}>
        <Form.Group>
          <Form.Control
            placeholder="Kitty Creator address"
            onChange={onCreatorChanged}
          />
          <Button type="submit">
            Add
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
