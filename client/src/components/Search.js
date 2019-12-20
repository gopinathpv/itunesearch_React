import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import styled from "styled-components";

import "./search.css";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      jsonband: [],
      imagePopup: "",
      isOpen: false,
      isLoading: false,
      isSubmitted: false,
      clicked: -1
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const searchTerm = event.target.value;
    this.setState({ value: searchTerm.toLowerCase() });
    if (searchTerm.length === 0) {
      this.setState({ jsonband: [] });
    }
    this.setState({ isSubmitted: false });
  }

  handleSubmit(event) {
    this.setState({ isLoading: true, isSubmitted: true });
    axios({
      url: "/data",
      method: "post",
      data: {
        value: this.state.value
      }
    }).then(response => {
      this.setState({ jsonband: response.data.bandd, isLoading: false });
    });
    event.preventDefault();
  }

  render() {
    const columns = [
      {
        Header: "Artist Name",
        accessor: "artistName"
      },
      {
        Header: "Collection Name",
        accessor: "collectionName"
      },
      {
        Header: "Track Name",
        accessor: "trackName"
      },
      {
        Header: "Primary Genre Name",
        accessor: "primaryGenreName"
      },
      {
        Header: "Collection Price($)",
        accessor: "collectionPrice"
      }
    ];

    const onRowClick = (state, rowInfo, column, instance) => {
      return {
        onClick: e => {
          this.setState({
            clicked: rowInfo.index,
            isOpen: true,
            imagePopup: rowInfo.original.artworkUrl100.replace(
              "100x100",
              "400x400"
            )
          });
        }
      };
    };
    const {
      imagePopup,
      isOpen,
      isLoading,
      isSubmitted,
      jsonband,
      value
    } = this.state;

    const jsodatalength = jsonband.length;
    const inputlength = value.length;

    return (
      <div>
        <FormField className="formstyle" onSubmit={this.handleSubmit}>
          <SearchText
            className="searchfield"
            type="text"
            placeholder="Your Library"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <ButtonField className="buttonfield" type="submit" value="Submit" />
        </FormField>

        {!isLoading && !isSubmitted && inputlength > 0 && (
          <TypingText>Hit Submit To Search</TypingText>
        )}
        {!isLoading && !isSubmitted && inputlength === 0 && (
          <TypingText>Welcome!!! Search For Your Favourite Music</TypingText>
        )}
        {jsodatalength > 0 && (
          <div>
            <ReactTable
              columns={columns}
              data={this.state.jsonband}
              getTrProps={onRowClick}
            ></ReactTable>
            <div>
              {isOpen && (
                <Lightbox
                  mainSrc={imagePopup}
                  onCloseRequest={() => this.setState({ isOpen: false })}
                />
              )}
            </div>
          </div>
        )}
        {!isLoading &&
          isSubmitted &&
          inputlength > 0 &&
          jsodatalength === 0 && (
            <TypingTexte> No music found for the input search </TypingTexte>
          )}
        {!isLoading &&
          isSubmitted &&
          inputlength === 0 &&
          jsodatalength === 0 && (
            <TypingText>Enter Band Name to Search</TypingText>
          )}
      </div>
    );
  }
}

export default Search;

const TypingText = styled.p`
  text-align: center;
  font-size: 40px;
`;

const TypingTexte = styled.p`
  text-align: center;
  font-size: 40px;
  color: red;
`;

const SearchText = styled.input`
  border: 2px solid rgb(77, 139, 201);
  width: 400px;
  height: 7%;
  font-size: 22px;
  &::-webkit-input-placeholder {
    color: rgb(77, 139, 201);
    font-size: 30px;
  }
`;

const ButtonField = styled.input`
  color: whitesmoke;
  width: 130px;
  height: 7%;
  font-size: 24px;
  background: rgb(77, 139, 201);
`;

const FormField = styled.form`
  padding-top: 9%;
  margin-left: 35%;
`;