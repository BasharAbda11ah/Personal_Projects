public class TreasureQuestion extends Question {
    private final String treasureLocation;

    public TreasureQuestion(String text, String correct, String treasureLocation) {
        super(text, correct);
        this.treasureLocation = treasureLocation;
    }

    public String getTreasureLocation() {
        return treasureLocation;
    }

    @Override
    public String[] getOptions() {
        return new String[]{"North", "South", "East", "West"};
    }
}
