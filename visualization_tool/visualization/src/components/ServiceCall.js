import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import RefactoringButton from "../components/RefactoringButton";
import Refactoring from "../components/Refactoring";
import StepButton from "./StepButton";

function ServiceCall({
  project,
  service,
  refactoringItems,
  setRefactoringItems,
  refactoring,
  showNumber,
}) {
  const handleOnClick = (index, text) => {
    setRefactoringItems("selected", index);
    setRefactoringItems("step", text);
    setRefactoringItems("color", "#687f8c");
  };

  const handleRefactorigClick = (index) => {
    setRefactoringItems("selected", index);
    setRefactoringItems("step",
      <Refactoring
        project={project}
        service={service}
        sequence={refactoring.refactorings}
        index={index - 2}
      ></Refactoring>
    );
    setRefactoringItems("color", "#1E488F");
  };

  return (
    <Row className="mt-2 blue-text">
      <p  style={{ fontSize: "1.15rem", fontWeight: "bold" }}>
        {showNumber ? (refactoringItems.index + 1).toString() + ". " : ""}
        {refactoring.name[0] + refactoring.name.slice(1).toLowerCase()}
      </p>
      <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
        Of method {refactoring.notes.method} from {refactoring.notes.target}
      </p>
      <div className="intermediate-text">
        <p className="d-flex align-self-start ms-5">
          Refactoring schematical representation:
        </p>
        <img
          className="pb-3"
          style={{ width: "90%", alignSelf: "center" }}
          src={`data:image/png;base64,${refactoringItems.image}`}
          alt="refactoring change schema"
        ></img>
        <p>
          To apply this refactoring, follow the below sequence of steps (
          <b>click on each of them to find out how to implement them</b>):
        </p>
        <div className="d-inline my-4">
          <Col className="d-inline me-3">
            <StepButton
              name="Decide the communication strategy"
              index={0}
              active={refactoringItems.selected}
              hasNext={true}
              handleClick={handleOnClick}
              text={
                "Decide the communication strategy (like HTTP or RPC, for example) and make the initial configurations to use it. Store the necessary information (e.g. URL) to make the remote calls to the microservice. - " +
                refactoring.notes.protocol
              }
            ></StepButton>
          </Col>
          <Col className="d-inline me-3">
            <StepButton
              name="Configure invoker"
              index={1}
              active={refactoringItems.selected}
              hasNext={true}
              handleClick={handleOnClick}
              text={[
                "Change the method calls to and from local components to be remote calls using this protocol to reach a different service:",
                "\n",
                "1. Create an interface with the declaration of the identified methods - " +
                  (refactoring.notes.interfaces !== undefined
                    ? refactoring.notes.interfaces
                    : "the interface was already created in a previous refactoring") +
                  ".",
                "\n",
                "2. Create a class that implements that interface and makes the service calls, a Request Class - " +
                  (refactoring.notes.new_classes[0] !== undefined
                    ? refactoring.notes.new_classes[0]
                    : "the request class was already created in a previous refactoring") +
                  ".",
              ]}
            ></StepButton>
          </Col>
          <Col className="d-inline me-3">
            <StepButton
              name="Configure method owner"
              index={2}
              active={refactoringItems.selected}
              hasNext={refactoring.refactorings}
              handleClick={handleOnClick}
              text={[
                "Arrange the microservice owning the method to respond to this communication protocol, creating an API to respond to the service calls.",
                "\n",
                "1. Create a class that defines the resource paths for the requests and processes them producing a response - " +
                  (refactoring.notes.new_classes[1] !== undefined
                    ? refactoring.notes.new_classes[1]
                    : "the request handler class was already created in a previous refactoring") +
                  ".",
                "\n",
                "2. Add methods to the class to perform the actions required by the service calls.",
              ]}
            ></StepButton>
          </Col>
          {refactoring.refactorings &&
            refactoring.refactorings.map((item, index) => {
              index = index + 2;
              return (
                <>
                  <Col className="d-inline">
                    <RefactoringButton
                      item={item}
                      active={refactoringItems.selected === index}
                      handleClick={handleRefactorigClick}
                      sequence={refactoring.refactorings}
                      index={index}
                      color="#1E488F"
                      showNumber={false}
                      selected={refactoringItems.selected}
                      step={refactoringItems.step}
                      setSelected={refactoringItems.setSelected}
                      setColor={refactoringItems.setColor}
                      setStep={refactoringItems.setStep}
                    ></RefactoringButton>
                  </Col>
                </>
              );
            })}
        </div>
        {refactoringItems.step !== undefined && (
          <Row
            id="implementation"
            className="d-flex justify-content-center py-3 my-3 mx-5 px-2"
            style={{ border: "3px dashed " + refactoringItems.color, "white-space": "pre-line" }}
          >
            {refactoringItems.step}
          </Row>
        )}

        <p className="mt-5" style={{ fontSize: "0.8rem" }}>
          Note: By default, we apply this refactoring implementing a synchronous
          call, however if you don't need an instant response or don't want a
          service to wait for the response, it can be asynchronous. Check the
          catalog to find out how to implement an asynchronous call.
        </p>
      </div>
    </Row>
  );
}

export default ServiceCall;
