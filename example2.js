// @example.js - Comprehensive Advanced JavaScript Examples for tree-sitter

// ============================================================================
// ADVANCED CLASSES AND OOP PATTERNS
// ============================================================================

// Base class with private fields and getters/setters
class Person {
  #ssn;
  #birthDate;

  constructor(name, birthDate, ssn) {
    this.name = name;
    this.#birthDate = birthDate;
    this.#ssn = ssn;
  }

  get age() {
    return Math.floor((new Date() - new Date(this.#birthDate)) / (365.25 * 24 * 60 * 60 * 1000));
  }

  set birthDate(date) {
    this.#birthDate = date;
  }

  get isAdult() {
    return this.age >= 18;
  }

  displayInfo() {
    return `${this.name} (${this.age} years old)`;
  }
}

// Advanced inheritance with super
class Employee extends Person {
  #salary;
  #department;

  constructor(name, birthDate, ssn, salary, department) {
    super(name, birthDate, ssn);
    this.#salary = salary;
    this.#department = department;
  }

  get salary() {
    return this.#salary;
  }

  set salary(newSalary) {
    if (newSalary > 0) {
      this.#salary = newSalary;
    }
  }

  get department() {
    return this.#department;
  }

  calculateAnnualBonus(percentage = 0.1) {
    return this.#salary * percentage;
  }

  displayInfo() {
    return `${super.displayInfo()} - ${this.#department}`;
  }

  static compareByAge(emp1, emp2) {
    return emp1.age - emp2.age;
  }

  static createManager(name, birthDate, ssn, salary) {
    const mgr = new Employee(name, birthDate, ssn, salary, 'Management');
    mgr.isManager = true;
    return mgr;
  }
}

// Mixin pattern for composition
const Loggable = {
  log(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  },

  error(message) {
    console.error(`[${this.constructor.name}] ERROR: ${message}`);
  }
};

const Timestampable = {
  getTimestamp() {
    return new Date().toISOString();
  },

  logWithTimestamp(message) {
    console.log(`[${this.getTimestamp()}] ${message}`);
  }
};

// Mixed class
class Document {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }
}
Object.assign(Document.prototype, Loggable, Timestampable);

// ============================================================================
// FUNCTIONAL PROGRAMMING AND ADVANCED PATTERNS
// ============================================================================

// Currying and partial application
const curry = (fn) => {
  const arity = fn.length;
  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }
    return fn.call(null, ...args);
  };
};

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
const addFive = curriedAdd(5);
const addFiveAndThree = addFive(3);

// Function composition
const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value);
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

const double = (x) => x * 2;
const addTen = (x) => x + 10;
const square = (x) => x * x;

const composed = compose(square, addTen, double);
const piped = pipe(double, addTen, square);

// Memoization decorator
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const fibonacci = memoize((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// Debounce and throttle
const debounce = (fn, delay) => {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

const throttle = (fn, delay) => {
  let lastCall = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
};

// ============================================================================
// ASYNC PATTERNS AND PROMISE HANDLING
// ============================================================================

// Complex async/await with error handling
async function fetchMultipleResources(urls) {
  const results = [];
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      results.push({ url, data, status: 'success' });
    } catch (error) {
      results.push({ url, error: error.message, status: 'failed' });
    }
  }
  
  return results;
}

// Promise.allSettled for robust parallel processing
async function loadUserDataRobustly(userIds) {
  const promises = userIds.map(id => 
    fetch(`/api/users/${id}`).then(r => r.json())
  );
  
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => ({
    userId: userIds[index],
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : result.reason
  }));
}

// Retry mechanism with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Complex async generator
async function* fetchDataInChunks(apiUrl, chunkSize = 10) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const response = await fetch(`${apiUrl}?page=${page}&limit=${chunkSize}`);
      const data = await response.json();
      
      yield data.items;
      
      hasMore = data.hasNextPage;
      page++;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMore = false;
    }
  }
}

// ============================================================================
// ADVANCED DESTRUCTURING AND SPREAD OPERATORS
// ============================================================================

// Nested destructuring with defaults and renaming
const { 
  user: { 
    profile: { 
      firstName: first, 
      lastName: last = 'Unknown',
      address: { city = 'N/A' } = {}
    } = {} 
  } = {} 
} = {
  user: {
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      address: { city: 'New York' }
    }
  }
};

// Rest parameters in destructuring
const [head, ...tail] = [1, 2, 3, 4, 5];
const { a, b, ...others } = { a: 1, b: 2, c: 3, d: 4, e: 5 };

// Spread in function calls and arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2, 7, 8, 9];

const obj1 = { x: 1, y: 2 };
const obj2 = { y: 3, z: 4 };
const merged2 = { ...obj1, ...obj2, w: 5 };

// ============================================================================
// ADVANCED COLLECTIONS AND DATA STRUCTURES
// ============================================================================

// Custom Map with expiring keys
class ExpiringMap extends Map {
  #timers = new Map();

  set(key, value, expiryMs) {
    super.set(key, value);
    
    if (this.#timers.has(key)) {
      clearTimeout(this.#timers.get(key));
    }
    
    if (expiryMs) {
      const timer = setTimeout(() => this.delete(key), expiryMs);
      this.#timers.set(key, timer);
    }
  }

  delete(key) {
    if (this.#timers.has(key)) {
      clearTimeout(this.#timers.get(key));
      this.#timers.delete(key);
    }
    return super.delete(key);
  }
}

// WeakMap for private data storage
const privateStorage = new WeakMap();

class BankAccount {
  constructor(initialBalance) {
    privateStorage.set(this, { balance: initialBalance });
  }

  deposit(amount) {
    const data = privateStorage.get(this);
    data.balance += amount;
  }

  getBalance() {
    return privateStorage.get(this).balance;
  }
}

// ============================================================================
// REGEX AND STRING MANIPULATION
// ============================================================================

// Advanced regex patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  phoneNumber: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
  ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
};

// String methods chaining
const processText = (text) => 
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

// Template tag function
const html = (strings, ...values) => {
  return strings.reduce((result, str, i) => {
    const value = values[i];
    const escaped = typeof value === 'string' 
      ? value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      : value;
    return result + str + (escaped ?? '');
  }, '');
};

const name = 'John';
const greeting = html`<div>Hello, ${name}!</div>`;

// ============================================================================
// PROXIES AND REFLECTION
// ============================================================================

// Complex Proxy with validation
const validator = {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    console.warn(`Property "${prop}" doesn't exist`);
    return undefined;
  },

  set(target, prop, value) {
    if (typeof value === 'number' && prop.includes('age')) {
      if (value < 0 || value > 150) {
        throw new RangeError(`Invalid age: ${value}`);
      }
    }
    target[prop] = value;
    return true;
  },

  has(target, prop) {
    return prop in target;
  },

  ownKeys(target) {
    return Object.keys(target);
  },

  getOwnPropertyDescriptor(target, prop) {
    return Object.getOwnPropertyDescriptor(target, prop);
  }
};

const user = new Proxy({}, validator);

// Reflect API usage
const reflectExample = {
  apply: Reflect.apply,
  construct: Reflect.construct,
  getPrototypeOf: Reflect.getPrototypeOf,
  setPrototypeOf: Reflect.setPrototypeOf
};

// ============================================================================
// ITERATORS AND GENERATORS
// ============================================================================

// Custom iterable class
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    const step = this.step;

    return {
      next: () => {
        if (current < end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { done: true };
      }
    };
  }
}

// Generator with yield* delegation
function* generatorA() {
  yield 1;
  yield 2;
}

function* generatorB() {
  yield* generatorA();
  yield 3;
}

// ============================================================================
// METACLASSES AND REFLECTION
// ============================================================================

// Class factory function
const createModel = (schema) => {
  return class Model {
    constructor(data) {
      for (const [key, validator] of Object.entries(schema)) {
        if (validator(data[key])) {
          this[key] = data[key];
        } else {
          throw new TypeError(`Invalid ${key}`);
        }
      }
    }

    toJSON() {
      return Object.fromEntries(
        Object.entries(this).filter(([, v]) => v !== undefined)
      );
    }
  };
};

const UserModel = createModel({
  name: (v) => typeof v === 'string' && v.length > 0,
  email: (v) => typeof v === 'string' && v.includes('@'),
  age: (v) => typeof v === 'number' && v > 0 && v < 150
});

// ============================================================================
// EVENT EMITTER PATTERN
// ============================================================================

class EventEmitter {
  #events = new Map();

  on(eventName, handler) {
    if (!this.#events.has(eventName)) {
      this.#events.set(eventName, []);
    }
    this.#events.get(eventName).push(handler);
  }

  once(eventName, handler) {
    const wrappedHandler = (...args) => {
      handler(...args);
      this.off(eventName, wrappedHandler);
    };
    this.on(eventName, wrappedHandler);
  }

  off(eventName, handler) {
    if (!this.#events.has(eventName)) return;
    const handlers = this.#events.get(eventName);
    const index = handlers.indexOf(handler);
    if (index !== -1) handlers.splice(index, 1);
  }

  emit(eventName, ...args) {
    if (!this.#events.has(eventName)) return;
    for (const handler of this.#events.get(eventName)) {
      handler(...args);
    }
  }
}

// ============================================================================
// ADVANCED ARRAY METHODS
// ============================================================================

// Chained array operations
const data = [
  { id: 1, name: 'John', score: 85 },
  { id: 2, name: 'Jane', score: 92 },
  { id: 3, name: 'Bob', score: 78 },
  { id: 4, name: 'Alice', score: 95 }
];

const topScorers = data
  .sort((a, b) => b.score - a.score)
  .slice(0, 2)
  .map(({ name, score }) => `${name}: ${score}`)
  .join(', ');

// Reduce with complex accumulation
const grouped = data.reduce((acc, item) => {
  const key = item.score >= 90 ? 'high' : 'low';
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {});

// ============================================================================
// MODULE PATTERN AND NAMESPACING
// ============================================================================

const AppModule = (() => {
  const privateVar = 'secret';
  
  const privateFunction = () => {
    return `This is private: ${privateVar}`;
  };

  return {
    publicMethod() {
      return privateFunction();
    },

    getPrivateVar() {
      return privateVar;
    },

    config: {
      version: '1.0.0',
      author: 'John Doe'
    }
  };
})();

// ============================================================================
// SYMBOLS AND WELL-KNOWN SYMBOLS
// ============================================================================

const symbolId = Symbol('id');
const symbolPrivate = Symbol.for('private');

class SymbolExample {
  constructor(id) {
    this[symbolId] = id;
    this[Symbol.toStringTag] = 'SymbolExample';
  }

  [Symbol.iterator]() {
    return {
      next: () => ({ done: true })
    };
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this[symbolId];
    }
    return `SymbolExample(${this[symbolId]})`;
  }
}

// ============================================================================
// COMPLEX CONDITIONAL LOGIC
// ============================================================================

// Switch with fallthrough
const getDayType = (day) => {
  let type;
  switch (day.toLowerCase()) {
    case 'monday':
    case 'tuesday':
    case 'wednesday':
    case 'thursday':
    case 'friday':
      type = 'weekday';
      break;
    case 'saturday':
    case 'sunday':
      type = 'weekend';
      break;
    default:
      type = 'unknown';
  }
  return type;
};

// Complex ternary chains
const getUserStatus = (user) =>
  !user ? 'anonymous' :
  !user.verified ? 'pending' :
  user.banned ? 'banned' :
  user.admin ? 'admin' :
  'active';
