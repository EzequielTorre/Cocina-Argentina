import React, { useState } from "react";
import { NavDropdown, Badge, ListGroup, Button } from "react-bootstrap";
import {
  FaBell,
  FaCircle,
  FaUtensils,
  FaComment,
  FaStar,
} from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
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
      case "comment":
        return <FaComment className="text-primary" />;
      case "rating":
        return <FaStar className="text-warning" />;
      default:
        return <FaUtensils className="text-info" />;
    }
  };

  return (
    <NavDropdown
      title={
        <div className="position-relative d-inline-block">
          <FaBell className="fs-4" style={{ color: "#ffc107" }} />
          {unreadCount > 0 && (
            <Badge
              pill
              bg="danger"
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: "0.6rem" }}
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
      className="mx-2 notification-dropdown"
    >
      <div className="dropdown-menu-content">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light sticky-top">
          <h6 className="mb-0 fw-bold">Notificaciones</h6>
          {notifications.length > 0 && (
            <Button
              variant="link"
              className="p-0 text-decoration-none small text-primary"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              {unreadCount > 0 ? "Marcar todas como leídas" : "Vaciadas"}
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
                className={`d-flex align-items-start gap-3 border-bottom py-3 ${
                  !notif.is_read ? "bg-light fw-bold" : ""
                }`}
              >
                <div className="mt-1 fs-5">{getIcon(notif.type)}</div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-start">
                    <p className="mb-1 small text-wrap">{notif.content}</p>
                    {!notif.is_read && (
                      <FaCircle
                        className="text-danger mt-1 flex-shrink-0"
                        size={8}
                      />
                    )}
                  </div>
                  <span className="text-muted small d-block">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <div className="p-5 text-center text-muted">
              <FaBell size={40} className="mb-3 opacity-25" />
              <p className="small mb-0">No tienes notificaciones</p>
            </div>
          )}
        </ListGroup>
      </div>

      <style>{`
        .notification-dropdown .dropdown-menu {
          padding: 0;
          border: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .dropdown-menu-content {
          width: 320px;
          max-height: 450px;
          overflow-y: auto;
        }

        /* Estilos para móviles y tablets */
        @media (max-width: 768px) {
          .notification-dropdown .dropdown-menu {
            position: fixed !important;
            top: 60px !important;
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
            max-width: none !important;
            transform: none !important;
          }
          
          .dropdown-menu-content {
            width: 100%;
            max-height: 70vh;
          }
        }

        .notification-dropdown .list-group-item {
          transition: background-color 0.2s ease;
        }
        
        .notification-dropdown .list-group-item:hover {
          background-color: rgba(0,0,0,0.02);
        }
      `}</style>
    </NavDropdown>
  );
};

export default NotificationBell;
