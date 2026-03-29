import { useEffect, useState } from "react";

const storageKey = "khushi-student-management-app";
const authKey = "khushi-student-management-auth";
const allowedCredentials = {
  username: "khushi",
  password: "12345"
};

const starterStudents = [
  {
    id: "student-1",
    firstName: "Aarav",
    lastName: "Sharma",
    className: "10-A",
    department: "Science",
    gender: 1,
    dateOfBirth: "2009-04-18",
    isGraduated: false,
    age: 16
  },
  {
    id: "student-2",
    firstName: "Diya",
    lastName: "Patel",
    className: "12-B",
    department: "Commerce",
    gender: 0,
    dateOfBirth: "2007-09-03",
    isGraduated: true,
    age: 18
  },
  {
    id: "student-3",
    firstName: "Kabir",
    lastName: "Reddy",
    className: "11-C",
    department: "Arts",
    gender: 1,
    dateOfBirth: "2008-01-12",
    isGraduated: false,
    age: 17
  }
];

const emptyForm = {
  firstName: "",
  lastName: "",
  className: "",
  department: "",
  gender: "1",
  dateOfBirth: "",
  isGraduated: "false"
};

export default function Home ()
{
  const [students, setStudents] = useState( starterStudents );
  const [searchTerm, setSearchTerm] = useState( "" );
  const [showAddModal, setShowAddModal] = useState( false );
  const [formData, setFormData] = useState( emptyForm );
  const [toastMessage, setToastMessage] = useState( "" );
  const [authForm, setAuthForm] = useState( { username: "", password: "" } );
  const [authError, setAuthError] = useState( "" );
  const [isAuthenticated, setIsAuthenticated] = useState( false );

  useEffect( () =>
  {
    const storedStudents = localStorage.getItem( storageKey );
    const storedAuth = localStorage.getItem( authKey );

    if ( storedStudents )
    {
      setStudents( JSON.parse( storedStudents ) );
    } else
    {
      localStorage.setItem( storageKey, JSON.stringify( starterStudents ) );
    }

    if ( storedAuth === "true" )
    {
      setIsAuthenticated( true );
    }
  }, [] );

  useEffect( () =>
  {
    localStorage.setItem( storageKey, JSON.stringify( students ) );
  }, [students] );

  useEffect( () =>
  {
    if ( !toastMessage )
    {
      return undefined;
    }

    const timer = window.setTimeout( () => setToastMessage( "" ), 3200 );
    return () => window.clearTimeout( timer );
  }, [toastMessage] );

  const filteredStudents = students.filter( student =>
    `${student.firstName} ${student.lastName} ${student.className} ${student.department}`
      .toLowerCase()
      .includes( searchTerm.toLowerCase().trim() )
  );

  const graduatedCount = students.filter( student => student.isGraduated ).length;
  const activeCount = students.length - graduatedCount;
  const averageAge = students.length
    ? Math.round( students.reduce( ( total, student ) => total + student.age, 0 ) / students.length )
    : 0;

  const calculateAge = dateOfBirth =>
  {
    const today = new Date();
    const birthDate = new Date( dateOfBirth );
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if ( monthDifference < 0 || ( monthDifference === 0 && today.getDate() < birthDate.getDate() ) )
    {
      age -= 1;
    }

    return age;
  };

  const handleLogin = e =>
  {
    e.preventDefault();

    if (
      authForm.username.trim().toLowerCase() === allowedCredentials.username &&
      authForm.password === allowedCredentials.password
    )
    {
      setIsAuthenticated( true );
      setAuthError( "" );
      localStorage.setItem( authKey, "true" );
      setToastMessage( "Welcome back, Khushi. Dashboard unlocked." );
      return;
    }

    setAuthError( "Use the authorized username and password to continue." );
  };

  const logout = () =>
  {
    setIsAuthenticated( false );
    localStorage.removeItem( authKey );
    setAuthForm( { username: "", password: "" } );
  };

  const updateForm = e =>
  {
    const { name, value } = e.target;
    setFormData( current => ( {
      ...current,
      [name]: value
    } ) );
  };

  const addStudent = e =>
  {
    e.preventDefault();

    const student = {
      id: `student-${Date.now()}`,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      className: formData.className.trim(),
      department: formData.department.trim(),
      gender: Number( formData.gender ),
      dateOfBirth: formData.dateOfBirth,
      isGraduated: formData.isGraduated === "true",
      age: calculateAge( formData.dateOfBirth )
    };

    setStudents( current => [student, ...current] );
    setFormData( emptyForm );
    setShowAddModal( false );
    setToastMessage( `${student.firstName} ${student.lastName} was added successfully.` );
  };

  if ( !isAuthenticated )
  {
    return (
      <main className="entry-page">
        <section className="entry-hero">
          <div className="entry-copy">
            <p className="eyebrow">Authorized Access</p>
            <h1>EduTrack App</h1>
            <p>
              Secure the dashboard, manage student records, and track live class stats from one beautiful workspace.
            </p>
            <div className="entry-image-frame">
              <img
                src="/login-illustration.svg"
                alt="Illustration of a secure student management login portal"
                className="feature-image"
              />
            </div>
          </div>

          <form className="login-card" onSubmit={handleLogin}>
            <h2>Sign In</h2>
            <div className="login-hint-box">
              <p className="login-hint">Authorized credentials</p>
              <div className="credential-pill-wrap">
                <span className="credential-pill">Username: khushi</span>
                <span className="credential-pill">Password: 12345</span>
              </div>
            </div>

            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={authForm.username}
              onChange={e => setAuthForm( current => ( { ...current, username: e.target.value } ) )}
              placeholder="Enter username"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={authForm.password}
              onChange={e => setAuthForm( current => ( { ...current, password: e.target.value } ) )}
              placeholder="Enter password"
            />

            {authError ? <p className="form-error">{authError}</p> : null}

            <button type="submit" className="btn primary-btn full-width">Enter Dashboard</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="home-page">
      <section className="hero-card">
        <div className="hero-copy-block">
          <p className="eyebrow">Dashboard</p>
          <h1>EduTrack App</h1>
          <p className="hero-copy">
            Review student activity, add fresh records in a popup, and see updates instantly in the live directory.
          </p>
          <div className="hero-actions">
            <button type="button" className="add-btn" onClick={() => setShowAddModal( true )}>Add Student</button>
            <button type="button" className="btn cancel" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="hero-image-frame">
          <img
            src="/dashboard-illustration.svg"
            alt="Illustration of a student management dashboard with cards and analytics"
            className="feature-image"
          />
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </article>
        <article className="stat-card">
          <span>Current Students</span>
          <strong>{activeCount}</strong>
        </article>
        <article className="stat-card">
          <span>Graduated</span>
          <strong>{graduatedCount}</strong>
        </article>
        <article className="stat-card">
          <span>Average Age</span>
          <strong>{averageAge}</strong>
        </article>
      </section>

      <section className="toolbar">
        <label className="search-box" htmlFor="student-search">
          <span>Search Students</span>
          <input
            id="student-search"
            type="text"
            placeholder="Find by name, class, or department"
            value={searchTerm}
            onChange={e => setSearchTerm( e.target.value )}
          />
        </label>
      </section>

      <section className="table-shell">
        <div className="table-header">
          <div>
            <h2>Student Directory</h2>
            <p>{filteredStudents.length} students visible</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Department</th>
                <th>Gender</th>
                <th>Birthday</th>
                <th>Status</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr className="empty-state-row">
                  <td colSpan="7">
                    <div className="empty-state">
                      <h3>No students found</h3>
                      <p>Add a student or try a different search term.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.map( student => (
                <tr key={student.id}>
                  <td>
                    <div className="student-name">
                      <strong>{student.firstName} {student.lastName}</strong>
                      <span>{student.className} student</span>
                    </div>
                  </td>
                  <td>{student.className}</td>
                  <td>{student.department}</td>
                  <td>{student.gender === 0 ? "Female" : "Male"}</td>
                  <td>{student.dateOfBirth}</td>
                  <td>
                    <span className={student.isGraduated ? "status-pill graduated" : "status-pill active"}>
                      {student.isGraduated ? "Graduated" : "Current"}
                    </span>
                  </td>
                  <td>{student.age}</td>
                </tr>
              ) )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={showAddModal ? "delete-modal" : "delete-modal hidden"}>
        <div className="modal-item large-modal">
          <div className="modal-head">
            <div>
              <h3>Add Student</h3>
              <p>Create a new record and watch the list update immediately.</p>
            </div>
            <button type="button" className="icon-close" onClick={() => setShowAddModal( false )}>x</button>
          </div>

          <form className="student-form-grid" onSubmit={addStudent}>
            <label>
              First Name
              <input name="firstName" value={formData.firstName} onChange={updateForm} required />
            </label>

            <label>
              Last Name
              <input name="lastName" value={formData.lastName} onChange={updateForm} required />
            </label>

            <label>
              Class Name
              <input name="className" value={formData.className} onChange={updateForm} required />
            </label>

            <label>
              Department
              <input name="department" value={formData.department} onChange={updateForm} required />
            </label>

            <label>
              Gender
              <select name="gender" value={formData.gender} onChange={updateForm}>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </label>

            <label>
              Date Of Birth
              <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={updateForm} required />
            </label>

            <label className="full-span">
              Graduation Status
              <select name="isGraduated" value={formData.isGraduated} onChange={updateForm}>
                <option value="false">Current Student</option>
                <option value="true">Graduated</option>
              </select>
            </label>

            <div className="modal-actions full-span">
              <button type="button" className="btn cancel" onClick={() => setShowAddModal( false )}>Cancel</button>
              <button type="submit" className="btn primary-btn">Save Student</button>
            </div>
          </form>
        </div>
      </section>

      {toastMessage ? (
        <section className="toast-popup">
          <strong>Success</strong>
          <span>{toastMessage}</span>
        </section>
      ) : null}
    </main>
  );
}
