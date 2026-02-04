import javafx.application.Application;
import javafx.application.Platform;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.util.List;

public class TreasureHuntGUI extends Application {

    private Stage stage;
    private Scene startScene, quizScene, resultScene, leaderboardScene;

    private final QuizManager quizManager = new QuizManager();

    // quiz state
    private String playerName;
    private long quizStartMillis;

    // quiz scene controls
    private Label questionLabel;
    private VBox optionsBox;
    private Label timerLabel;
    private Label feedbackLabel;
    private Button nextButton;

    // timer
    private Thread timerThread;          // Thread-based timer
    private volatile boolean timerRunning;
    private int timeLeftPerQuestion = 15;

    @Override
    public void start(Stage primaryStage) {
        this.stage = primaryStage;
        stage.setTitle("HuntMaster Quest – Treasure Hunt Quiz");

        startScene = buildStartScene();
        stage.setScene(startScene);
        stage.show();
    }

    // ---------- Start Scene ----------
    private Scene buildStartScene() {
        Label title = new Label("HUNTMASTER QUEST");
        title.setStyle("-fx-font-size: 24px; -fx-font-weight: bold;");

        Label subtitle = new Label("Treasure Hunt Quiz Game");
        subtitle.setStyle("-fx-font-size: 16px;");

        // NOTE ABOUT TIMER (your requested warning)
        Label timerInfo = new Label("Note: You will have 15 seconds to answer each question.");
        timerInfo.setStyle("-fx-font-size: 13px; -fx-text-fill: #555555;");

        Label nameLbl = new Label("Enter your name to begin:");
        TextField nameField = new TextField();
        nameField.setMaxWidth(220);

        Button startBtn = new Button("Start Quiz");
        startBtn.setStyle(buttonStyle());
        startBtn.setOnAction(e -> {
            playerName = nameField.getText().trim();
            if (playerName.isEmpty()) {
                showAlert("Please enter your name.");
                return;
            }
            quizManager.reset();
            quizStartMillis = System.currentTimeMillis();
            quizScene = buildQuizScene();
            stage.setScene(quizScene);
        });

        VBox root = new VBox(15, title, subtitle, timerInfo, nameLbl, nameField, startBtn);
        root.setAlignment(Pos.CENTER);
        root.setPadding(new Insets(25));

        return new Scene(root, 600, 400);
    }

    // ---------- Quiz Scene ----------
    private Scene buildQuizScene() {
        Question q = quizManager.getCurrentQuestion();

        Label header = new Label("Treasure Hunt Quiz");
        header.setStyle("-fx-font-size: 20px; -fx-font-weight: bold;");

        timerLabel = new Label("Time left: " + timeLeftPerQuestion + "s");
        timerLabel.setStyle("-fx-font-size: 16px; -fx-text-fill: red;");

        questionLabel = new Label(q.getQuestionText());
        questionLabel.setWrapText(true);
        questionLabel.setStyle("-fx-font-size: 16px;");

        optionsBox = new VBox(10);
        optionsBox.setAlignment(Pos.CENTER_LEFT);

        feedbackLabel = new Label();
        feedbackLabel.setStyle("-fx-font-size: 14px;");

        nextButton = new Button("Next");
        nextButton.setDisable(true);
        nextButton.setStyle(buttonStyle());
        nextButton.setOnAction(e -> {
            if (quizManager.hasMoreQuestions()) {
                quizManager.nextQuestion();
                stage.setScene(buildQuizScene());
            } else {
                long totalSeconds = (System.currentTimeMillis() - quizStartMillis) / 1000;
                quizManager.setTimeTakenSeconds(totalSeconds);
                quizManager.saveResult(playerName);
                resultScene = buildResultScene();
                stage.setScene(resultScene);
            }
        });

        populateOptions(q);

        VBox root = new VBox(15,
                header,
                timerLabel,
                questionLabel,
                optionsBox,
                feedbackLabel,
                nextButton
        );
        root.setAlignment(Pos.TOP_CENTER);
        root.setPadding(new Insets(20));

        startQuestionTimer(q);

        return new Scene(root, 700, 450);
    }

    private void populateOptions(Question q) {
        optionsBox.getChildren().clear();
        String[] ops = q.getOptions();

        for (String op : ops) {
            Button b = new Button(op);
            b.setStyle(buttonStyle());
            b.setMaxWidth(Double.MAX_VALUE);
            b.setOnAction(e -> handleAnswer(q, op, b));
            optionsBox.getChildren().add(b);
        }
    }

    private void handleAnswer(Question q, String selected, Button clickedButton) {
        stopQuestionTimer();

        boolean correct = q.checkAnswer(selected);
        if (correct) {
            quizManager.incrementScore();
            feedbackLabel.setText("Correct!");
        } else {
            feedbackLabel.setText("Wrong. Correct answer: " + q.getCorrectAnswer());
        }

        if (q instanceof TreasureQuestion && correct) {
            TreasureQuestion tq = (TreasureQuestion) q;
            feedbackLabel.setText(
                    feedbackLabel.getText() +
                            " Treasure location: " + tq.getTreasureLocation()
            );
        }

        // disable all option buttons
        for (Node node : optionsBox.getChildren()) {
            node.setDisable(true);
        }
        nextButton.setDisable(false);
    }

    // ---------- Timer using Thread ----------
    private void startQuestionTimer(Question q) {
        stopQuestionTimer();  // stop old one if running

        timeLeftPerQuestion = 15;
        timerRunning = true;

        timerThread = new Thread(() -> {
            try {
                while (timerRunning && timeLeftPerQuestion >= 0) {
                    final int t = timeLeftPerQuestion;
                    Platform.runLater(() ->
                            timerLabel.setText("Time left: " + t + "s")
                    );
                    Thread.sleep(1000);
                    timeLeftPerQuestion--;
                }

                if (timerRunning && timeLeftPerQuestion < 0) {
                    Platform.runLater(() -> {
                        feedbackLabel.setText(
                                "Time's up! Correct answer: " + q.getCorrectAnswer()
                        );
                        for (Node node : optionsBox.getChildren()) {
                            node.setDisable(true);
                        }
                        nextButton.setDisable(false);
                    });
                }
            } catch (InterruptedException ignored) {
            }
        });

        timerThread.setDaemon(true);
        timerThread.start();
    }

    private void stopQuestionTimer() {
        timerRunning = false;
        if (timerThread != null && timerThread.isAlive()) {
            timerThread.interrupt();
        }
    }

    // ---------- Result Scene ----------
    private Scene buildResultScene() {
        Label title = new Label("Quiz Finished!");
        title.setStyle("-fx-font-size: 22px; -fx-font-weight: bold;");

        Label summary = new Label(
                playerName + ", your score is " +
                        quizManager.getScore() + " / " + quizManager.getTotalQuestions()
        );
        summary.setStyle("-fx-font-size: 16px;");

        Label timeLbl = new Label("Total time: " +
                quizManager.getTimeTakenSeconds() + " seconds");

        Button leaderboardBtn = new Button("View Leaderboard");
        leaderboardBtn.setStyle(buttonStyle());
        leaderboardBtn.setOnAction(e -> {
            leaderboardScene = buildLeaderboardScene();
            stage.setScene(leaderboardScene);
        });

        Button playAgainBtn = new Button("Play Again");
        playAgainBtn.setStyle(buttonStyle());
        playAgainBtn.setOnAction(e -> {
            quizManager.reset();
            stage.setScene(startScene);
        });

        Button exitBtn = new Button("Exit");
        exitBtn.setStyle(buttonStyle());
        exitBtn.setOnAction(e -> stage.close());

        HBox buttons = new HBox(10, leaderboardBtn, playAgainBtn, exitBtn);
        buttons.setAlignment(Pos.CENTER);

        VBox root = new VBox(15, title, summary, timeLbl, buttons);
        root.setAlignment(Pos.CENTER);
        root.setPadding(new Insets(25));

        return new Scene(root, 600, 400);
    }

    // ---------- Leaderboard Scene ----------
    private Scene buildLeaderboardScene() {
        Label title = new Label("Leaderboard");
        title.setStyle("-fx-font-size: 20px; -fx-font-weight: bold;");

        List<QuizManager.PlayerResult> list = quizManager.loadLeaderboard();

        VBox listBox = new VBox(5);
        listBox.setAlignment(Pos.TOP_LEFT);

        if (list.isEmpty()) {
            listBox.getChildren().add(new Label("No results yet."));
        } else {
            int rank = 1;
            for (QuizManager.PlayerResult r : list) {
                if (rank > 10) break;
                Label row = new Label(
                        rank + ". " + r.name + " - " +
                                r.score + " pts - " +
                                r.timeSeconds + " sec");
                listBox.getChildren().add(row);
                rank++;
            }
        }

        Button backBtn = new Button("Back");
        backBtn.setStyle(buttonStyle());
        backBtn.setOnAction(e -> stage.setScene(resultScene));

        VBox root = new VBox(15, title, listBox, backBtn);
        root.setAlignment(Pos.CENTER);
        root.setPadding(new Insets(20));

        return new Scene(root, 600, 400);
    }

    // ---------- Helpers ----------
    private String buttonStyle() {
        return "-fx-font-size: 14px; -fx-padding: 8 16 8 16;";
    }

    private void showAlert(String msg) {
        Alert a = new Alert(Alert.AlertType.INFORMATION);
        a.setHeaderText(null);
        a.setContentText(msg);
        a.showAndWait();
    }
}
