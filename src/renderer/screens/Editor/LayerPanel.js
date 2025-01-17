/* eslint-disable react/jsx-filename-extension */
import React from "react";

// Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Styled from "styled-components";

// Icons
import {
  MdLock,
  MdShare,
  MdPublish,
  MdContentCopy,
  MdUnarchive,
  MdDelete,
  MdAdd,
  MdGetApp
} from "react-icons/md";

const toolsWidth = 45;

const Styles = Styled.div`
.nameField {
  height: 40px;
  padding: 7px 3px;
}
.layer-editor {
  width: ${toolsWidth * 4}px;
  z-index: 11;
  float: left;
  margin-left: 0.5em;
  margin-top: 0.5em;
  position: absolute;
  padding: 0;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: 10px;
  box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 2px 1px -1px rgb(0 0 0 / 12%);
  svg {
    vertical-align: initial;
  }

  .layer-tools {
    margin: 0;
    button {
      width: ${toolsWidth}px;
      color: ${({ theme }) => theme.colors.button.text};
      background-color: transparent;
      border: 0px;
      font-size: x-large;
    }
    button:hover {
      background-color: ${({ theme }) => theme.colors.button.disabled};
    }
    button:focus {
      background-color: ${({ theme }) => theme.colors.button.background};
      color: ${({ theme }) => theme.colors.button.text};
      box-shadow: none;
    }
    button:active {
      background-color: ${({ theme }) => theme.colors.button.active};
      box-shadow: none !important;
    }
  }
  .layers {
    margin: 0;
    justify-content: center;
    padding-top: 10px;
    .layer-button {
      width: 95%;
      border: 0px;
      font-size: medium;
      color: ${({ theme }) => theme.colors.button.text};
      background-color: transparent;
    }
    button:hover {
      background-color: ${({ theme }) => theme.colors.button.hover};
    }
    button:focus {
      background-color: ${({ theme }) => theme.colors.button.hover};
      color: ${({ theme }) => theme.colors.button.text};
      box-shadow: none;
    }
    button:active {
      background-color: ${({ theme }) => theme.colors.button.active};
      box-shadow: none !important;
    }
    .btn-primary:not(:disabled):not(.disabled).active {
      background-color: ${({ theme }) => theme.colors.button.active};
      color: ${({ theme }) => theme.colors.button.text};
      box-shadow: none !important;
    }
    .button-content,
    .left,
    .right,
    .index {
      display: inline;
    }
    .index{
      float: left;
      border: 1px solid;
      border-radius: 100px;
      width: 22px;
    }
    .left{
      float: left;
      font-weight: 200;
      padding-left: 10px;
      vertical-align: middle;
    }
    .right {
      float: right;
      svg {
        vertical-align: sub;
        font-size: larger;
      }
    }
  }
  .layer-share {
    margin: 0;
    button {
      width: 100%;  //TODO: when updating share button, change this value back to 50%
      color: ${({ theme }) => theme.colors.button.text};
      background-color: transparent;
      border: 0px;
      font-size: x-large;
    }

    button:hover {
      background-color: ${({ theme }) => theme.colors.button.disabled};
    }
    button:focus {
      background-color: ${({ theme }) => theme.colors.button.background};
      color: ${({ theme }) => theme.colors.button.text};
      box-shadow: none;
    }
    button:active {
      background-color: ${({ theme }) => theme.colors.button.active};
      box-shadow: none !important;
    }
  }
}
}`;

export default class LayerPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLayer: props.currentLayer,
      isReadOnly: props.isReadOnly,
      editCurrent: -1
    };
    this.ActOnClick = this.ActOnClick.bind(this);
    this.LayerSel = this.LayerSel.bind(this);
    this.updateText = this.updateText.bind(this);
    this.spare = this.spare.bind(this);
  }

  spare() {
    console.log("disabled");
  }

  LayerSel(id) {
    let { selectLayer } = this.props;
    console.log(id);
    selectLayer(id);
    this.setState({
      currentLayer: id,
      editCurrent: -1
    });
  }

  CButton(text, func, icon, disable) {
    const id = `tooltip-${text}`;

    return (
      <OverlayTrigger rootClose overlay={<Tooltip id={id}>{text}</Tooltip>}>
        <Button disabled={disable} onClick={func}>
          {icon}
        </Button>
      </OverlayTrigger>
    );
  }

  ActOnClick(id) {
    let { currentLayer } = this.state;

    if (currentLayer == id) {
      this.setState({
        editCurrent: id
      });
    } else {
      this.LayerSel(id);
    }
  }

  updateText(event) {
    this.props.changeLayerName(event.target.value);
  }

  render() {
    const { isReadOnly, editCurrent } = this.state;
    const {
      layers,
      currentLayer,
      importTitle,
      exportTitle,
      exportAllTitle,
      importFunc,
      exportFunc,
      exportAllFunc,
      copyTitle,
      copyFunc,
      clearTitle,
      clearFunc
    } = this.props;

    const layerButtons = layers.map(({ name, id }, idx) => {
      const menuKey = `layer-menu-${id.toString()}`;
      return (
        <Button
          key={menuKey}
          onClick={() => {
            this.ActOnClick(id);
          }}
          className="layer-button"
          active={currentLayer === id}
        >
          <div className="button-content">
            {editCurrent == id ? (
              <Form.Control
                value={name}
                as="textarea"
                className="nameField"
                onChange={this.updateText}
              />
            ) : (
              <React.Fragment>
                <div className="left">{(idx + 1).toString() + ": " + name}</div>
                <div className="right">
                  {currentLayer === id && isReadOnly ? <MdLock /> : <></>}
                </div>
              </React.Fragment>
            )}
          </div>
        </Button>
      );
    });

    const buttons = (
      <>
        {/* {this.CButton("Add - Layer", this.spare, <MdAdd />, true)} */}
        {this.CButton(importTitle, importFunc, <MdGetApp />, false)}
        {this.CButton(exportTitle, exportFunc, <MdPublish />, false)}
        {this.CButton(copyTitle, copyFunc, <MdContentCopy />, false)}
        {this.CButton(clearTitle, clearFunc, <MdDelete />, false)}
      </>
    );

    const shareb = (
      <>
        {/* {this.CButton(
          "Share your Layers! comming soon",
          this.spare,
          <MdShare />,
          true
        )} */}
        {this.CButton(exportAllTitle, exportAllFunc, <MdUnarchive />, false)}
      </>
    );

    return (
      <Styles>
        <Container fluid className="layer-editor">
          <Row className="layers">{layerButtons}</Row>
          <Row className="layer-tools">{buttons}</Row>
          {/* <Row className="layer-share">{shareb}</Row> */}
        </Container>
      </Styles>
    );
  }
}
