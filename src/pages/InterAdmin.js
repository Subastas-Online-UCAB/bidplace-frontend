// Importamos los hooks y componentes necesarios de React y React-Bootstrap
import React, { useState } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';

// Componente principal de administración de usuarios y permisos
const InterAdmin = () => {
  // Estado que almacena la lista de usuarios del sistema
  const [userList, setUserList] = useState([
    { id: 1, name: 'María González', role: 'Subastador' },
    { id: 2, name: 'Luis Ramírez', role: 'Postor' },
    { id: 3, name: 'Ana Torres', role: 'Administrador' }
  ]);

  // Estado con todos los permisos del sistema
  const [permissions, setPermissions] = useState([
    { id: 1, name: 'Crear subasta' },
    { id: 2, name: 'Editar perfil' },
    { id: 3, name: 'Ver historial' }
  ]);

  // Permisos que están actualmente asignados (esto debería asociarse a un usuario real en producción)
  const [assignedPermissions, setAssignedPermissions] = useState([
    { id: 1, name: 'Crear subasta' }
  ]);

  // Estados de visibilidad para los modales y vistas
  const [showPermissions, setShowPermissions] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [showCreatePermissionModal, setShowCreatePermissionModal] = useState(false);
  const [showAssignPermissionModal, setShowAssignPermissionModal] = useState(false);

  // Estado para almacenar el ID del usuario seleccionado para cambiar rol o asignar permiso
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Estado del input para crear un nuevo permiso
  const [newPermission, setNewPermission] = useState('');

  // ID del permiso seleccionado a asignar
  const [selectedPermissionId, setSelectedPermissionId] = useState('');

  // Datos simulados del usuario logueado
  const currentUser = {
    name: 'Juan Pérez',
    role: 'InterAdmin'
  };

  // Función que abre el modal para cambiar el rol de un usuario
  const handleOpenChangeRoleModal = (userId) => {
    setSelectedUserId(userId);
    setShowChangeRoleModal(true);
  };

  // Función que cambia el rol del usuario seleccionado
  const handleChangeRole = (newRole) => {
    const displayRole = newRole === 'InterAdmin' ? 'Administrador' : newRole;
    setUserList(userList.map((user) =>
      user.id === selectedUserId ? { ...user, role: displayRole } : user
    ));
    setShowChangeRoleModal(false);

    // INTEGRACIÓN BACKEND AQUÍ:
    // Aquí debes enviar una solicitud PUT/PATCH al backend para actualizar el rol del usuario
  };

  // Función que elimina un usuario de la lista
  const handleDeleteUser = (userId) => {
    setUserList(userList.filter((user) => user.id !== userId));

    // INTEGRACIÓN BACKEND AQUÍ:
    // Aquí deberías enviar una solicitud DELETE al backend para eliminar el usuario
  };

  // Función que elimina un permiso de la lista asignada
  const handleDeletePermission = (permissionId) => {
    setAssignedPermissions(assignedPermissions.filter((permiso) => permiso.id !== permissionId));

    // INTEGRACIÓN BACKEND AQUÍ:
    // Aquí deberías enviar una solicitud DELETE para desasignar el permiso del usuario
  };

  // Función que crea un nuevo permiso y lo agrega a la lista
  const handleCreatePermission = () => {
    const newId = permissions.length + 1; // Generación simple de ID (en producción lo hace el backend)
    setPermissions([...permissions, { id: newId, name: newPermission }]);
    setNewPermission('');
    setShowCreatePermissionModal(false);

    // INTEGRACIÓN BACKEND AQUÍ:
    // Aquí debes enviar una solicitud POST al backend para guardar el nuevo permiso
  };

  // Función que asigna un permiso existente a la lista de asignados
  const handleAssignPermission = () => {
    const permisoSeleccionado = permissions.find(p => p.id === parseInt(selectedPermissionId));
    if (permisoSeleccionado && !assignedPermissions.some(p => p.id === permisoSeleccionado.id)) {
      setAssignedPermissions([...assignedPermissions, permisoSeleccionado]);

      // INTEGRACIÓN BACKEND AQUÍ:
      // Aquí debes enviar una solicitud POST o PUT para asignar el permiso al usuario correspondiente
    }
    setSelectedPermissionId('');
    setShowAssignPermissionModal(false);
  };

  // Lista de permisos disponibles para asignar (los que aún no han sido asignados)
  const availablePermissions = permissions.filter(p =>
    !assignedPermissions.some(ap => ap.id === p.id)
  );

  // Renderizado principal
  return (
    <Container className="my-5">
      {currentUser.role === 'InterAdmin' && (
        <>
          {!showPermissions ? (
            <>
              {/* Vista de gestión de usuarios */}
              <Row className="mb-4">
                <Col>
                  <h3>Gestión de Usuarios</h3>
                </Col>
              </Row>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nombre del Usuario</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.role}</td>
                      <td>
                        <Button variant="info" className="btn-sm me-2" onClick={() => setShowPermissions(true)}>
                          Ver Permisos
                        </Button>
                        <Button variant="warning" className="btn-sm me-2" onClick={() => handleOpenChangeRoleModal(user.id)}>
                          Cambiar Rol
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <>
              {/* Vista de gestión de permisos */}
              <Row className="mb-4 align-items-center">
                <Col xs="auto">
                  <Button variant="success" className="ms-2" onClick={() => setShowAssignPermissionModal(true)}>
                    Agregar Permiso
                  </Button>
                </Col>
                <Col className="text-end">
                  <h3>Permisos Asignados</h3>
                </Col>
              </Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nombre del Permiso</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedPermissions.map((permiso) => (
                    <tr key={permiso.id}>
                      <td>{permiso.name}</td>
                      <td>
                        <Button variant="danger" className="btn-sm" onClick={() => handleDeletePermission(permiso.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Botón Volver pequeño abajo a la izquierda */}
              <div className="d-flex justify-content-start mt-3">
                <Button variant="secondary" className="btn-sm" onClick={() => setShowPermissions(false)}>
                  Volver
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {/* MODAL PARA CAMBIAR ROL */}
      <Modal show={showChangeRoleModal} onHide={() => setShowChangeRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nuevo Rol</Form.Label>
            <Form.Select onChange={(e) => handleChangeRole(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="Postor">Postor</option>
              <option value="Subastador">Subastador</option>
              <option value="InterAdmin">Administrador</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
      </Modal>

      {/* MODAL PARA CREAR NUEVO PERMISO */}
      <Modal show={showCreatePermissionModal} onHide={() => setShowCreatePermissionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nombre del Permiso</Form.Label>
            <Form.Control
              type="text"
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreatePermissionModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleCreatePermission}>Crear</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL PARA ASIGNAR PERMISO EXISTENTE */}
      <Modal show={showAssignPermissionModal} onHide={() => setShowAssignPermissionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availablePermissions.length > 0 ? (
            <Form.Group>
              <Form.Label>Selecciona un permiso</Form.Label>
              <Form.Select value={selectedPermissionId} onChange={(e) => setSelectedPermissionId(e.target.value)}>
                <option value="">Seleccionar</option>
                {availablePermissions.map((permiso) => (
                  <option key={permiso.id} value={permiso.id}>{permiso.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : (
            <p className="text-muted">No hay permisos disponibles para asignar.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignPermissionModal(false)}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={handleAssignPermission}
            disabled={!selectedPermissionId}
          >
            Asignar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InterAdmin;
