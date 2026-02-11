import { Card, Placeholder } from "react-bootstrap";

const RecipeCardSkeleton = () => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <div style={{ height: "220px", backgroundColor: "#e9ecef" }}>
        <Placeholder as="div" animation="glow" className="h-100 w-100" />
      </div>
      <Card.Body className="d-flex flex-column">
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
          <Placeholder xs={12} />
          <Placeholder xs={10} />
        </Placeholder>
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top gap-2">
          <Placeholder xs={4} bg="secondary" />
          <Placeholder.Button
            variant="primary"
            xs={4}
            className="rounded-pill"
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecipeCardSkeleton;
