import React, { Component } from "react";
import axiosInstance from "../axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// reorders cards
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#F8F8F8" : "#F8F8F8",
  padding: grid,
  overflow: "auto",
  "max-height": 300,
  width: 250,
});

// container that allows us to change order of markers in each layer
export default class DnD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    this.getItems();
  }

  componentDidUpdate(prevProps) {
    if (prevProps || prevProps.currentlayer.id === undefined) {
      if (prevProps.currentlayer.id !== this.props.currentlayer.id) {
        this.getItems();
      }
    }
  }

  // get cards
  getItems = () => {
    let options = "";
    if (this.props.layerlandmarks) {
      options = this.props.layerlandmarks
        .sort((a, b) => (a.position > b.position ? 1 : -1))
        .map((e, index) => ({
          id: `${e.id}`,
          content: `${index + 1}: ${e.content}`.slice(0, 90),
        }));
      this.setState({ items: options });
    } else {
      this.setState({ items: [] });
    }
  };

  // when card is dropped, update markers
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    // update markers
    items.forEach((item, index) => {
      let marker = items[index];
      if (index == items.length - 1) {
        const response = axiosInstance
          .patch(`/landmarks/${marker.id}/`, {
            position: index,
          })
          .then((response) => {
            this.props.rerenderParentCallback();
          });
      } else {
        const response = axiosInstance.patch(`/landmarks/${marker.id}/`, {
          position: index,
        });
      }
    });

    this.setState({
      items,
    });
  }

  
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
