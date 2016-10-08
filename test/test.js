describe("GameOfLife", function() {

  it("Normalization in impossible ranges.", function() {
    expect(normalize.bind(normalize, 4, 0)).to.throw(ReferenceError);
    expect(normalize.bind(normalize, 1, 1, 2)).to.throw(ReferenceError);
  });

  it("Single normalization above the upper limit.", function() {
    assert.equal(normalize(2, 3), 2);
    assert.equal(normalize(3, 3), 0);
    assert.equal(normalize(4, 3), 1);
    assert.equal(normalize(12, 10, 1), 3);
    assert.equal(normalize(10, 10, 9), 9);
  });

  it("Single normalization below the lower limit.", function() {
    assert.equal(normalize(-1, 3), 2);
    assert.equal(normalize(0, 3, 1), 2);
    assert.equal(normalize(-5, 10), 5);
    assert.equal(normalize(8, 10, 9), 9);
  });
});