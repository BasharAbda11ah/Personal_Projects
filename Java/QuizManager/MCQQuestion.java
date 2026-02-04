public class MCQQuestion extends Question {
    private final String[] options;

    public MCQQuestion(String text, String[] options, String correct) {
        super(text, correct);
        this.options = options;
    }

    @Override
    public String[] getOptions() {
        return options;
    }
}
