public class TFQQuestion extends Question {

    public TFQQuestion(String text, String correct) {
        super(text, correct);
    }

    @Override
    public String[] getOptions() {
        return new String[]{"True", "False"};
    }
}
