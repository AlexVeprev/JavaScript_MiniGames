describe("GameOfLife", function() {

  it("Normalization in impossible ranges.", function() {
    expect(normalize.bind(normalize, 4, 0)).to.throw(Error);
    expect(normalize.bind(normalize, 1, 1, 2)).to.throw(Error);
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

  it("Single normalization in negative ranges.", function() {
    assert.equal(normalize(-1, -1, -5), -5);
    assert.equal(normalize(0, -1, -5), -4);
    assert.equal(normalize(-6, -4, -5), -5);
    assert.equal(normalize(-15, -1, -10), -6);
  });


  it("Matrixes 1x1 comparison.", function() {
    var array1x1_1 = [[1]];
    var array1x1_2 = [[2]];

    assert(areMatrixesEqual(array1x1_1, array1x1_1), array1x1_1 + " equals to " + array1x1_1);
    assert(!areMatrixesEqual(array1x1_1, array1x1_2), array1x1_1 + " does not equal to " + array1x1_2);
  });

  it("Matrixes 3x3 comparison.", function() {
    var array3x3_1 = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
    var array3x3_2 = [[1, 1, 1], [1, 1, 1], [1, 1, 0]];
    var array3x3_3 = [[0, 1, 1], [1, 1, 1], [1, 1, 1]];

    assert(areMatrixesEqual(array3x3_1, array3x3_1), array3x3_1 + " equals to " + array3x3_1);
    assert(!areMatrixesEqual(array3x3_1, array3x3_2), array3x3_1 + " does not equal to " + array3x3_2);
    assert(!areMatrixesEqual(array3x3_2, array3x3_3), array3x3_2 + " does not equal to " + array3x3_3);
  });

  it("Matrixes 5x3 comparison.", function() {
    var array5x3_1 = [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];
    var array5x3_2 = [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 0]];
    var array5x3_3 = [[0, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];

    assert(areMatrixesEqual(array5x3_1, array5x3_1), array5x3_1 + " equals to " + array5x3_1);
    assert(!areMatrixesEqual(array5x3_1, array5x3_2), array5x3_1 + " does not equal to " + array5x3_2);
    assert(!areMatrixesEqual(array5x3_2, array5x3_3), array5x3_2 + " does not equal to " + array5x3_3);
  });
});