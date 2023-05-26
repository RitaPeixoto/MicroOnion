import { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import RefactoringButton from "../components/RefactoringButton";
import Refactoring from "../components/Refactoring";
import StepButton from "./StepButton";
import r2 from "../assets/refactoring_2.png";

function ChangeDataOwnership({
  project,
  service,
  refactoringItems,
  setRefactoringItems,
  refactoring,
  refactoringItems2,
  setRefactoringItems2,
  showNumber,
}) {
  const [loadStep, setLoadStep] = useState(undefined);
  const [step, setStep] = useState(undefined);
  const handleOnClick = (index, text) => {
    setLoadStep(true);
    setStep(text);
    setRefactoringItems((prev) => ({
      ...prev,
      selected: index,
      color: "#687f8c",
    }));
    setLoadStep(false);
  };

  const handleRefactoringClick = (index) => {
    setStep(undefined);
    setLoadStep(true);
    setRefactoringItems2((prev) => ({
      ...prev,
      selected: undefined,
      step: undefined,
      color: undefined,
      index: index,
      sequence: refactoring.refactorings,
      image: undefined,
    })); //todo: fazer aqui o pedido da imagem

    let idx = index + 1;

    setRefactoringItems((prev) => ({
      ...prev,
      selected: idx,
      color: "#1E488F",
    }));

    setLoadStep(false);
  };

  return (
    <Row className="mt-2 blue-text">
      <p style={{ fontSize: "1.15rem", fontWeight: "bold" }}>
        {showNumber ? (refactoringItems.index + 1).toString() + ". " : ""}
        {refactoring.name[0] + refactoring.name.slice(1).toLowerCase()}
      </p>
      <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
        Of {refactoring.notes.entity} to Service {service.microservice}
      </p>
      <div className="intermediate-text">
        <p className="d-flex align-self-start ms-5">
          Refactoring schematical representation:
        </p>
        <img
          className="pb-3"
          style={{ width: "90%", alignSelf: "center" }}
          src={r2}
          alt="refactoring change schema"
        ></img>
        <p>
          To apply this refactoring, follow the below sequence of steps (
          <b>click on each of them to find out how to implement them</b>):
        </p>
        <div className="d-inline my-4">
          <Col className="d-inline me-3">
            <StepButton
              name="Change Owner"
              index={0}
              active={refactoringItems.selected}
              hasNext={true}
              handleClick={handleOnClick}
              text="When extracting a new service that encapsulates the business logic of
              some data, that data should belong to that service and, therefore,
              should be moved into the new service. This service will then become
              the owner of the data/table/entity."
            ></StepButton>
          </Col>
          {refactoring.refactorings &&
            refactoring.refactorings.map((item, index) => {
              return (
                <>
                  <RefactoringButton
                    key={index}
                    item={item}
                    active={refactoringItems.selected === index + 1}
                    handleClick={handleRefactoringClick}
                    sequence={refactoring.refactorings}
                    index={index}
                    color="#1E488F"
                    showNumber={false}
                  ></RefactoringButton>
                </>
              );
            })}
        </div>
        {loadStep !== undefined && (
          <Row
            id="implementation"
            className="d-flex justify-content-center py-3 my-3 mx-5 px-2"
            style={{ border: "3px dashed " + refactoringItems.color }}
          >
            {loadStep === true ? (
              <></>
            ) : (
              <>
                {step !== undefined ? (
                  <>{step}</>
                ) : (
                  <Refactoring
                    project={project}
                    service={service}
                    refactoringItems={refactoringItems2}
                    setRefactoringItems={setRefactoringItems2}
                    refactoringItems2={{}}
                    setRefactoringItems2={() => {}}
                    showNumber={false}
                  />
                )}
              </>
            )}
          </Row>
        )}

        <p className="mt-5" style={{ fontSize: "0.8rem" }}>
          Note: In this case we only portray the case of not needing to break a
          database table. You can find the other cases in the catalog, like
          splitting a table, replication, etc. .
        </p>
      </div>
    </Row>
  );
}

export default ChangeDataOwnership;
