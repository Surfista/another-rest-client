var should = require('chai').should();

var RestClient = require('../rest-client');

var host = 'http://example.com';

describe('RestClient', () => {
    describe('#res()', () => {
        var api;

        beforeEach(() => api = new RestClient(host));

        it('should accept resource name and return resource', () => {
            var cookies = api.res('cookies');
            cookies.should.be.a('function');
        });

        it('should accept array of resource names and return array of resources', () => {
            var t = api.res(['bees', 'cows']);
            t.should.be.an('array');
        });

        it('should make a shortcut for resource by default', () => {
            api.should.not.have.property('cookies');
            var cookies = api.res('cookies');
            api.cookies.should.be.equal(cookies);
        });

        it('should make a shortcut for resource array by default', () => {
            api.should.not.have.property('cookies');
            api.should.not.have.property('cows');

            var arr = api.res(['cookies', 'cows']);

            api.cookies.should.be.equal(arr[0]);
            api.cows.should.be.equal(arr[1]);
        });

        it('should not make a shortcut if pass option to constructor', () => {
            var api = new RestClient(host, {shortcut: false});
            api.should.not.have.property('cookies');
            var cookies = api.res('cookies');
            api.should.not.have.property('cookies');
        });

        it('should not make a shortcut if pass false to second option', () => {
            api.should.not.have.property('cookies');
            var cookies = api.res('cookies', false);
            api.should.not.have.property('cookies');
        });

        it('should cache created resources', () => {
            var cookies = api.res('cookies');
            cookies.should.be.a('function');
            var cookies2 = api.res('cookies');
            cookies.should.be.eql(cookies2);
        });
    });


    describe('resource', () => {
        var api;

        beforeEach(() => api = new RestClient(host));

        it('should build correct resource url', () => {
            var cookies = api.res('cookies');
            cookies.url().should.be.equal('/cookies');
        });

        it('should build correct resource instance url', () => {
            var cookies = api.res('cookies');
            cookies.url(42).should.be.equal('/cookies/42');
        });

        it('should append trailing symbol which passed to constructor', () => {
            var api = new RestClient(host, {trailing: '/'});
            var cookies = api.res('cookies');
            cookies.url().should.be.equal('/cookies/');
        });

        it('should build correct resource url if two in stack', () => {
            var cookies = api.res('cookies');
            cookies.res('bakers');
            cookies(42).bakers.url(24).should.be.equal('/cookies/42/bakers/24');
        });

        it('should build correct resource url if more than two in stack', () => {
            var cookies = api.res('cookies');
            cookies.res('bakers').res('cats');
            cookies(42).bakers(24).cats.url(15).should.be.equal('/cookies/42/bakers/24/cats/15');
        });
    });
});