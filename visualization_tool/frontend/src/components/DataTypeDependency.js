import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import RefactoringButton from "../components/RefactoringButton";
import Refactoring from "../components/Refactoring";
import StepButton from "./StepButton";
import axios from "axios";

function DataTypeDependency({
  project,
  service,
  refactoringItems,
  setRefactoringItems,
  refactoring,
  refactoringItems2,
  setRefactoringItems2,
}) {
  const [loadStep, setLoadStep] = useState(undefined);
  const [step, setStep] = useState(undefined);
  const indexLast =
    1 + (refactoring.refactorings ? refactoring.refactorings.length + 1 : 0);

  const [scrollToElementId, setScrollToElement] = useState();

  const scrollToElement = (id) => {
    let element = document.getElementById(id);
    let header = document.getElementById("header");
    if (element) {
      setTimeout(scroll, 500);
      function scroll() {
        window.scrollTo(
          element.offsetLeft,
          element.offsetTop - header.offsetHeight
        );
        setScrollToElement("");
      }
    }
  };

  const handleOnClick = (index, text) => {
    setLoadStep(true);
    setStep(text);
    setScrollToElement("implementationStep");
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
    let id = refactoring.refactorings[index].id;
    try {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}projects/${project}/getRefactoringImage/${service.microservice}/${id}`,
          {
            headers: {
              "Content-Type": "image/png",
            },
          }
        )
        .then((res) => {
          setRefactoringItems2((prev) => ({
            ...prev,
            selected: undefined,
            step: undefined,
            color: undefined,
            index: index,
            sequence: refactoring.refactorings,
            image: res.data,
          }));

          let idx = refactoring.notes.interfaces ? index + 2 : index + 1;

          setRefactoringItems((prev) => ({
            ...prev,
            selected: idx,
            color: "#1E488F",
          }));

          setLoadStep(false);
          setScrollToElement("implementationStep");
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollToElement(scrollToElementId);
  }, [scrollToElementId]);

  function hasDTO(arr) {
    for (let i in arr) {
      if (arr[i].name === "CREATE DATA TRANSFER OBJECT") {
        return true;
      }
    }
    return false;
  }

  return (
    <>
      <div className="d-inline my-4">
        <Col className="d-inline me-3">
          <StepButton
            name="Identify where the data type is used"
            index={0}
            active={refactoringItems.selected}
            hasNext={true}
            handleClick={handleOnClick}
            text={
              "For example, the method invocations from the data type class, variable, parameters or return types of the data type. In this case, the dependencies are: " +
              refactoring.notes.dependencies
            }
          ></StepButton>
        </Col>
        {refactoring.notes.interfaces ? (
          <Col className="d-inline me-3">
            <StepButton
              name="Create an interface"
              index={1}
              active={refactoringItems.selected}
              hasNext={refactoring.refactorings}
              handleClick={handleOnClick}
              text={
                "Create an interface with the same name as the data type, " +
                refactoring.notes.interfaces +
                ", that defines the methods invocations identified for use through the data transfer object to make service calls to the data owner."
              }
            ></StepButton>
          </Col>
        ) : (
          <></>
        )}

        {refactoring.refactorings &&
          refactoring.refactorings.map((item, index) => {
            const seq = refactoring.refactorings + {};

            return (
              <RefactoringButton
                key={index}
                item={item}
                active={
                  refactoringItems.selected ===
                  (refactoring.notes.interfaces ? index + 2 : index + 1)
                }
                handleClick={handleRefactoringClick}
                sequence={seq}
                index={index}
                color="#1E488F"
                showNumber={false}
              ></RefactoringButton>
            );
          })}
        <Col className="d-inline me-3">
          <StepButton
            name="Make the necessary changes"
            index={indexLast}
            active={refactoringItems.selected}
            hasNext={false}
            handleClick={handleOnClick}
            text="Make the necessary changes in the code to use the new data type (return types, variables and parameters) and the right interface for the method calls."
          ></StepButton>
        </Col>
        {hasDTO(refactoring.refactorings) ? (
          <></>
        ) : (
          <p>
            An earlier refactoring created the data transfer object. Use the DTO
            that has already been created.
          </p>
        )}
        {refactoring.notes.dependencies.includes("methodInvocation") &&
        refactoring.notes.interfaces === undefined ? (
          <p>
            In a prior refactoring, the interface for the definition of the
            DTO's method invocations was already created. Use the interface that
            has already been created.
          </p>
        ) : (
          <></>
        )}
      </div>

      <Row id="implementationStep" className="mx-5">
        {loadStep !== undefined && (
          <>
            {loadStep === true ? (
              <></>
            ) : (
              <>
                <div
                  className="d-flex justify-content-center py-3 my-3 px-2"
                  style={{ border: "3px dashed " + refactoringItems.color }}
                >
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
                </div>
              </>
            )}
          </>
        )}
      </Row>

      <p className="mt-3" style={{ fontSize: "0.8rem" }}>
        Note: By default we assume the data type is owned and exist only on the
        microservice where it was first defined. However, there are two other
        options that can be used keeping it in both microservices: to use one as
        a proxy or to do replication
      </p>
    </>
  );
}

export default DataTypeDependency;
