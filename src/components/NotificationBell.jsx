import React, { useState } from "react";
import { NavDropdown, Badge, ListGroup, Button } from "react-bootstrap";
import { FaBell, FaCircle, FaUtensils, FaComment, FaStar } from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }
    setShow(false);
    if (notif.recipe_id) {
      navigate(`/receta/${notif.recipe_id}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "comment": return <FaComment className="text-primary" />;
      case "rating": return <FaStar className="text-warning" />;
      default: return <FaUtensils className="text-info" />;
    }
  };

  return (
    <NavDropdown
      title={
        <div className="position-relative d-inline-block">
          <FaBell className="fs-4 text-white" />
          {unreadCount > 0 && (
            <Badge 
              pill 
              bg="danger" 
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '0.6rem' }}
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      }
      id="notifications-dropdown"
      align="end"
      show={show}
      onToggle={(isOpen) => setShow(isOpen)}
      className="mx-2"
    >
      <div style={{ width: "320px", maxHeight: "450px", overflowY: "auto" }}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light sticky-top">
          <h6 className="mb-0 fw-bold">Notificaciones</h6>
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              className="p-0 text-decoration-none small"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              Marcar todo como leído
            </Button>
          )}
        </div>

        <ListGroup variant="flush">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <ListGroup.Item 
                key={notif.id}
                action
                onClick={() => handleNotificationClick(notif)}
                className={`d-flex align-items-start gap-3 border-bottom py-3 ${!notif.is_read ? 'bg-light fw-bold' : ''}`}
              >
                <div className="mt-1 fs-5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-start">
                    <p className="mb-1 small text-wrap">{notif.content}</p>
                    {!notif.is_read && <FaCircle className="text-danger mt-1 flex-shrink-0" size={8} />}
                  </div>
                  <span className="text-muted small d-block">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <div className="p-4 text-center text-muted">
              <p className="mb-0 small">No tienes notificaciones todavía</p>
            </div>
          )}
        </ListGroup>
      </div>
    </NavDropdown>
  );
};

export default NotificationBell;
