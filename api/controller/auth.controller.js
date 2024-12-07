
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { username, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await connectToDB();
      await connection.execute('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)', [
        uuidv4(),
        username,
        hashedPassword,
        role || 'user',
      ]);
      await connection.end();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
};

export const signin = async (req, res) => {
    const { username, password } = req.body;

  try {
    const connection = await connectToDB();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const addtrain = async (req, res) => {
    const { source, destination, totalSeats } = req.body;
  
    try {
      const connection = await connectToDB();
      await connection.execute('INSERT INTO trains (id, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)', [
        uuidv4(),
        source,
        destination,
        totalSeats,
        totalSeats,
      ]);
      await connection.end();
  
      res.status(201).json({ message: 'Train added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding train' });
    }
  };

 export const bookseat = async (req, res) => {
    const { trainId } = req.body;
    const userId = req.user.id;
  
    try {
      const connection = await connectToDB();
      await connection.beginTransaction();
  
      const [rows] = await connection.execute('SELECT available_seats FROM trains WHERE id = ? FOR UPDATE', [trainId]);
  
      if (rows.length === 0 || rows[0].available_seats <= 0) {
        await connection.rollback();
        return res.status(400).json({ message: 'No seats available' });
      }
  
      await connection.execute('UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?', [trainId]);
      await connection.execute('INSERT INTO bookings (id, user_id, train_id) VALUES (?, ?, ?)', [uuidv4(), userId, trainId]);
  
      await connection.commit();
      await connection.end();
  
      res.status(200).json({ message: 'Seat booked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error booking seat' });
    }
  };
  
  // Get specific booking details
  export const bookingdetails =  async (req, res) => {
    const userId = req.user.id;
  
    try {
      const connection = await connectToDB();
      const [rows] = await connection.execute('SELECT * FROM bookings WHERE user_id = ?', [userId]);
      await connection.end();
  
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  };

  export const gettrains = async (req, res) => {
    const { source, destination } = req.query;
  
    try {
      const connection = await connectToDB();
      const [rows] = await connection.execute('SELECT * FROM trains WHERE source = ? AND destination = ?', [source, destination]);
      await connection.end();
  
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching trains' });
    }
  };
  
  