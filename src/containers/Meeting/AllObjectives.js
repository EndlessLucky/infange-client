import React, { useState } from "react";
import Modal from "../../../components/controls/Modal";

const AllObjectives = () => {
  return (
    <>
      <Modal
        open={this.state.objectiveIsOpen}
        onClose={this.handleCloseObjective}
        title="Objective"
        style={{
          height: "600px",
          width: "550px",
          position: "fixed",
          left: "50%",
          top: "42%",
          marginTop: "-250px",
          marginLeft: "-250px",
        }}
      >
        <div style={{ overflowY: "auto", maxHeight: 600 }}>
          <AddObjective onComplete={this.handleCloseObjective} />
        </div>
      </Modal>
    </>
  );
};

export default AllObjectives;
