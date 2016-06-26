import {expect} from 'chai';
import {AffWord, affWordToColoredString} from './aff';
import {parseAffFileToAff} from './affReader';

describe('Test Aff', () => {
    const nlAff = __dirname + '/../dictionaries/nl.aff';
    const enAff = __dirname + '/../dictionaries/en_US.aff';
    const esAff = __dirname + '/../dictionaries/es_ANY.aff';

    it('test breaking up rules for nl', () => {
        return parseAffFileToAff(nlAff)
            .then(aff => {
                expect(aff.separateRules('ZbCcChC1')).to.be.deep.equal(['Zb', 'Cc', 'Ch', 'C1']);
                expect(aff.separateRules('ZbCcChC199')).to.be.deep.equal(['Zb', 'Cc', 'Ch', 'C1', '99']);
            });
    });


    it('test breaking up rules for en', () => {
        return parseAffFileToAff(enAff)
            .then(aff => {
                expect(aff.separateRules('ZbCcChC1')).to.not.be.deep.equal(['Zb', 'Cc', 'Ch', 'C1']);
                expect(aff.separateRules('ZbCcChC1')).to.be.deep.equal('ZbCcChC1'.split(''));
            });
    });


    it('test getting rules for nl', () => {
        return parseAffFileToAff(nlAff)
            .then(aff => {
                // console.log(aff.getMatchingRules('ZbCcChC1'));
                expect(aff.getMatchingRules('ZbCcChC1').filter(a => !!a).map(({id}) => id))
                    .to.be.deep.equal(['Zb', 'Cc', 'Ch']);
                expect(aff.getMatchingRules('ZbCcChC199').filter(a => !!a).map(({id}) => id))
                    .to.be.deep.equal(['Zb', 'Cc', 'Ch']);
                expect(aff.getMatchingRules('AaAbAcAdAeAi').filter(a => !!a).map(({id}) => id))
                    .to.be.deep.equal(['Aa', 'Ab', 'Ac', 'Ad', 'Ae', 'Ai']);
                expect(aff.getMatchingRules('AaAbAcAdAeAi').filter(a => !!a).map(({type}) => type))
                    .to.be.deep.equal(['sfx', 'sfx', 'sfx', 'sfx', 'sfx', 'sfx']);
                expect(aff.getMatchingRules('PaPbPc').filter(a => !!a).map(({type}) => type))
                    .to.be.deep.equal(['pfx', 'pfx', 'pfx', ]);
            });
    });

    it('tests applying rules for nl', () => {
        return parseAffFileToAff(nlAff)
            .then(aff => {
                const lines = [
                'aak/Zf',
                'huis/CACcYbCQZhC0',
                'pannenkoek/ZbCACcC0',
                ];
                lines.forEach(line => {
                    const r = aff.applyRulesToDicEntry(line);
                    logApplyRulesResults(r);
                });
            });
    });

    it('tests applying rules for es', () => {
        return parseAffFileToAff(esAff)
            .then(aff => {
                const lines = [
                    'ababillar/E',
                    // 'ababillar/RED',
                ];
                lines.forEach(line => {
                    const r = aff.applyRulesToDicEntry(line);
                    logApplyRulesResults(r);
                });
            });
    });


    it('tests applying rules for en', () => {
        return parseAffFileToAff(enAff)
            .then(aff => {
                const r = aff.applyRulesToDicEntry('motivate/CDSG');
                logApplyRulesResults(r);
            });
    });

});

function logApplyRulesResults(affWords: AffWord[]) {
    affWords.forEach(logApplyRulesResult);
}

function logApplyRulesResult(affWord: AffWord) {
    console.log(affWordToColoredString(affWord));
}