/*global it:true */
"use strict";

var describeWd = require("../../helpers/driverblock.js").describeForApp('UICatalog')
  , logger = require('../../../logger').get('appium')
  , should = require("should");

var dump2 = function(s) {
  logger.info("/*****************************************************\\");
  logger.info(s);
  logger.info("\\*****************************************************/");
};

var dump2Source = function(h, done) {
  h.driver.source(function(err, source) {
  dump2(JSON.stringify(JSON.parse(source), undefined, 2));
  done();
});};
describeWd('execute', function(h) {
  it('should require a web view to be selected', function(done) {
    h.driver.execute("1 + 1", function(err, value) {
    should.exist(err);
    should.not.exist(value);
    done();
  });});
});

var selectWebView = function(h, callback) {
  h.driver.elementsByTagName('tableCell', function(err, elems) {
  elems[7].click(function() {
  h.driver.windowHandles(function(err, handles) {
  should.exist(handles);
  handles.length.should.equal(1);
  h.driver.window(handles[0], callback);
  });});});
};

describeWd("execute", function(h) {
  return it("should bubble up javascript errors", function(done) {
  selectWebView(h, function() {
  h.driver.execute("'nan'--", function(err, val) {
  err.message.should.equal("Error response status: 13.");
  should.not.exist(val);
  done();});});});
});

describeWd("execute", function(h) {
  return it("should eval javascript", function(done) {
  selectWebView(h, function() {
  h.driver.execute("return 1", function(err, val) {
  should.not.exist(err);
  val.should.equal(1);
  done();});});});
});

describeWd("execute", function(h) {
  return it("should not be returning hardcoded results", function(done) {
  selectWebView(h, function() {
  h.driver.execute("return 1+1", function(err, val) {
  should.not.exist(err);
  val.should.equal(2);
  done();});});});
});

describeWd("execute", function(h) {
  it("should return nothing when you don't explicitly return", function(done) {
  selectWebView(h, function() {
  h.driver.execute("1+1", function(err, val) {
  should.not.exist(err);
  should.not.exist(val);
  done();});});});
});

var loadWebView = function(driver, cb) {
  driver.elementByName('Web, Use of UIWebView', function(err, el) {
    should.not.exist(err);
    el.click(function(err) {
      should.not.exist(err);
      driver.windowHandles(function(err, handles) {
        should.not.exist(err);
        handles.length.should.be.above(0);
        driver.elementByTagName('textField', function(err, elem) {
          elem.sendKeys("http://www.saucelabs.com/test/guinea-pig", function(err) {
            should.not.exist(err);
            driver.keys("\\uE007", function(err) {
              should.not.exist(err);
              driver.window(handles[0], function(err) {
                should.not.exist(err);
                spinTitle('I am a page title - Sauce Labs', driver, cb);
              });
            });
          });
        });
      });
    });
  });
};

var spinTitle = function (expTitle, driver, cb, timeout) {
  timeout = typeof timeout == 'undefined' ? 60 : timeout;
  timeout.should.be.above(0);
  driver.title(function(err, pageTitle) {
    should.not.exist(err);
    if (pageTitle == expTitle) {
      cb();
    } else {
      setTimeout(function () {
        spinTitle(expTitle, driver, cb, timeout - 1);
      }, 500);
    }
  });
};

describeWd("execute", function(h) {
  return it("should execute code inside the web view", function(done) {
  loadWebView(h.driver, function() {

  var mynewfunctionorwhateveryouwannailiketocallthesethingsnextsometimes = function() {
    h.driver.execute('return document.body.innerHTML.indexOf("I am some page content") > 0', function(err, val) {
    // dump2(err);dump2(val);
    should.not.exist(err);
    val.should.equal(true);
    h.driver.execute('return document.body.innerHTML.indexOf("I am not some page content") > 0', function(err, val) {
      // dump2(err);dump2(val);
    should.not.exist(err);
    val.should.equal(false);
    done();
    });});
  };
  setTimeout(mynewfunctionorwhateveryouwannailiketocallthesethingsnextsometimes, 5000);
  });});
});
