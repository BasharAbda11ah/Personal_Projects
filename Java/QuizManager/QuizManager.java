import java.io.*;
import java.util.*;

public class QuizManager {

    // Inner class = one coding-related improvement
    public static class PlayerResult {
        public final String name;
        public final int score;
        public final long timeSeconds;

        public PlayerResult(String name, int score, long timeSeconds) {
            this.name = name;
            this.score = score;
            this.timeSeconds = timeSeconds;
        }

        @Override
        public String toString() {
            return name + " - " + score + " pts - " + timeSeconds + " sec";
        }
    }

    private final List<Question> questions = new ArrayList<>();
    private int currentIndex = 0;
    private int score = 0;
    private long timeTakenSeconds = 0;

    public QuizManager() {
        loadQuestions();
    }

    private void loadQuestions() {
        questions.clear();
        questions.add(new MCQQuestion(
                "What color is the sky on a clear day?",
                new String[]{"Green", "Blue", "Yellow", "Red"},
                "Blue"
        ));

        questions.add(new TFQQuestion(
                "Java is an object-oriented language.",
                "True"
        ));

        questions.add(new MCQQuestion(
                "Which keyword is used to inherit a class in Java?",
                new String[]{"this", "super", "extends", "implements"},
                "extends"
        ));

        questions.add(new TreasureQuestion(
                "The treasure lies in which direction?",
                "East",
                "Crystal Cave"
        ));

        questions.add(new TFQQuestion(
                "The value of PI is approximately 3.14.",
                "True"
        ));
    }

    public void reset() {
        currentIndex = 0;
        score = 0;
        timeTakenSeconds = 0;
    }

    public Question getCurrentQuestion() {
        if (currentIndex >= 0 && currentIndex < questions.size()) {
            return questions.get(currentIndex);
        }
        return null;
    }

    public boolean hasMoreQuestions() {
        return currentIndex < questions.size() - 1;
    }

    public void nextQuestion() {
        if (hasMoreQuestions()) {
            currentIndex++;
        }
    }

    public int getTotalQuestions() {
        return questions.size();
    }

    public int getScore() {
        return score;
    }

    public void incrementScore() {
        score++;
    }

    public long getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(long timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    // ---------- Leaderboard ----------

    private File getLeaderboardFile() {
        return new File("leaderboard.txt");
    }

    public void saveResult(String name) {
        try (FileWriter fw = new FileWriter(getLeaderboardFile(), true);
             BufferedWriter bw = new BufferedWriter(fw);
             PrintWriter out = new PrintWriter(bw)) {
            out.println(name + "," + score + "," + timeTakenSeconds);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<PlayerResult> loadLeaderboard() {
        List<PlayerResult> list = new ArrayList<>();
        File f = getLeaderboardFile();
        if (!f.exists()) return list;

        try (BufferedReader br = new BufferedReader(new FileReader(f))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length != 3) continue;
                String name = parts[0];
                int s = Integer.parseInt(parts[1]);
                long t = Long.parseLong(parts[2]);
                list.add(new PlayerResult(name, s, t));
            }
        } catch (IOException | NumberFormatException e) {
            e.printStackTrace();
        }

        // Lambda comparator = another improvement
        list.sort(
                Comparator.<PlayerResult, Integer>comparing(r -> r.score)
                          .reversed()
                          .thenComparingLong(r -> r.timeSeconds)
        );

        return list;
    }
}
