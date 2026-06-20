# The AI Kitchen: A Data Nutrition Simulator 🍳🤖

**The AI Kitchen** is an educational, interactive web simulator designed for students aged 10-14 to teach the fundamentals of Artificial Intelligence data quality, bias detection, and data curating (data engineering). 

Developed for the **IEEE Future Tech Explorers Challenge**.

## 🧠 Educational Concept
* **Data = Food, AI = Customer**: If you feed the AI bad ingredients (outdated information, bias, noise, hate speech), the final model will produce disastrous, hilarious, and unexpected outcomes (e.g., creating mutant dogs or medical mishaps).
* **Pedagogical Friction**: Implements features like "Noise Overload" (penalizing spam clicking by slowing down the game) to force critical reading and analysis of incoming data rather than simple pattern matching.

---

## 🚀 How to Run the Simulator

### Option 1: Docker (Recommended)
You can run this game anywhere instantly using Docker and Docker Compose.

1. **Start the game:**
   ```bash
   docker-compose up --build
   ```
2. **Access the simulator:**
   Open your browser and navigate to `http://localhost:8080`.

3. **Stop the game:**
   ```bash
   docker-compose down
   ```

### Option 2: Running Directly (No Installation)
Since the simulator is built purely with HTML5, CSS3, and ES Modules (JavaScript):
* Just open `index.html` in your web browser.
* Or run a simple local web server (e.g., `npx http-server` or Python's `python -m http.server 8000`) in this directory.

---

## 🛠️ Key Technologies
* **Frontend**: Vanilla HTML5, CSS3 (Neon Cyberpunk Aesthetics, Low-Spec Mode support for Chromebooks), and ES Modules JavaScript.
* **Architecture**: Deterministic State-Machine Game Engine (no expensive LLM APIs needed, completely safe for children).
