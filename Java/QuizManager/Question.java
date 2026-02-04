public abstract class Question {
    protected String questionText;
    protected String correctAnswer;

    public Question(String questionText, String correctAnswer) {
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public boolean checkAnswer(String userAnswer) {
        return userAnswer != null
                && userAnswer.trim().equalsIgnoreCase(correctAnswer.trim());
    }

    public abstract String[] getOptions();
}
