import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-eligible-countries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eligible-countries.component.html',
  styleUrl: './eligible-countries.component.scss',
})
export class EligibleCountriesComponent {
  eligibleCountries: any[] = [
    { name: 'Andorra', flagUrl: '/assets/demo/images/flags/ad.svg' },
    { name: 'Austria', flagUrl: '/assets/demo/images/flags/at.svg' },
    { name: 'Bahrain', flagUrl: '/assets/demo/images/flags/bh.svg' },
    { name: 'Belgium', flagUrl: '/assets/demo/images/flags/be.svg' },
    { name: 'Bulgaria', flagUrl: '/assets/demo/images/flags/bg.svg' },
    { name: 'Cambodia', flagUrl: '/assets/demo/images/flags/kh.svg' },
    { name: 'China', flagUrl: '/assets/demo/images/flags/cn.svg' },
    { name: 'Croatia', flagUrl: '/assets/demo/images/flags/hr.svg' },
    { name: 'Cyprus', flagUrl: '/assets/demo/images/flags/cy.svg' },
    { name: 'Czech Republic', flagUrl: '/assets/demo/images/flags/cz.svg' },
    { name: 'Denmark', flagUrl: '/assets/demo/images/flags/dk.svg' },
    { name: 'Estonia', flagUrl: '/assets/demo/images/flags/ee.svg' },
    { name: 'Finland', flagUrl: '/assets/demo/images/flags/fi.svg' },
    { name: 'France', flagUrl: '/assets/demo/images/flags/fr.svg' },
    { name: 'Germany', flagUrl: '/assets/demo/images/flags/de.svg' },
    { name: 'Greece', flagUrl: '/assets/demo/images/flags/gr.svg' },
    { name: 'Hungary', flagUrl: '/assets/demo/images/flags/hu.svg' },
    { name: 'Iceland', flagUrl: '/assets/demo/images/flags/is.svg' },
    { name: 'India', flagUrl: '/assets/demo/images/flags/in.svg' },
    { name: 'Indonesia', flagUrl: '/assets/demo/images/flags/id.svg' },
    {
      name: 'Iran, Islamic Republic of',
      flagUrl: '/assets/demo/images/flags/ir.svg',
    },
    { name: 'Ireland', flagUrl: '/assets/demo/images/flags/ie.svg' },
    { name: 'Italy', flagUrl: '/assets/demo/images/flags/it.svg' },
    { name: 'Japan', flagUrl: '/assets/demo/images/flags/jp.svg' },
    {
      name: "Korea, Democratic People's Republic of",
      flagUrl: '/assets/demo/images/flags/kp.svg',
    },
    { name: 'Kuwait', flagUrl: '/assets/demo/images/flags/kw.svg' },
    { name: 'Latvia', flagUrl: '/assets/demo/images/flags/lv.svg' },
    { name: 'Liechtenstein', flagUrl: '/assets/demo/images/flags/li.svg' },
    { name: 'Lithuania', flagUrl: '/assets/demo/images/flags/lt.svg' },
    { name: 'Luxembourg', flagUrl: '/assets/demo/images/flags/lu.svg' },
    { name: 'Malaysia', flagUrl: '/assets/demo/images/flags/my.svg' },
    { name: 'Malta', flagUrl: '/assets/demo/images/flags/mt.svg' },
    { name: 'Mexico', flagUrl: '/assets/demo/images/flags/mx.svg' },
    { name: 'Monaco', flagUrl: '/assets/demo/images/flags/mc.svg' },
    { name: 'Myanmar', flagUrl: '/assets/demo/images/flags/mm.svg' },
    { name: 'Netherlands', flagUrl: '/assets/demo/images/flags/nl.svg' },
    { name: 'North Macedonia', flagUrl: '/assets/demo/images/flags/mk.svg' },
    { name: 'Norway', flagUrl: '/assets/demo/images/flags/no.svg' },
    { name: 'Oman', flagUrl: '/assets/demo/images/flags/om.svg' },
    { name: 'Philippines', flagUrl: '/assets/demo/images/flags/ph.svg' },
    { name: 'Poland', flagUrl: '/assets/demo/images/flags/pl.svg' },
    { name: 'Portugal', flagUrl: '/assets/demo/images/flags/pt.svg' },
    { name: 'Romania', flagUrl: '/assets/demo/images/flags/ro.svg' },
    { name: 'San Marino', flagUrl: '/assets/demo/images/flags/sm.svg' },
    { name: 'Saudi Arabia', flagUrl: '/assets/demo/images/flags/sa.svg' },
    { name: 'Serbia', flagUrl: '/assets/demo/images/flags/rs.svg' },
    { name: 'Singapore', flagUrl: '/assets/demo/images/flags/sg.svg' },
    { name: 'Slovakia', flagUrl: '/assets/demo/images/flags/sk.svg' },
    { name: 'Slovenia', flagUrl: '/assets/demo/images/flags/si.svg' },
    { name: 'Spain', flagUrl: '/assets/demo/images/flags/es.svg' },
    { name: 'Sweden', flagUrl: '/assets/demo/images/flags/se.svg' },
    { name: 'Switzerland', flagUrl: '/assets/demo/images/flags/ch.svg' },
    { name: 'Taiwan, China', flagUrl: '/assets/demo/images/flags/tw.svg' },
    { name: 'Turkey', flagUrl: '/assets/demo/images/flags/tr.svg' },
    { name: 'Vatican', flagUrl: '/assets/demo/images/flags/va.svg' },
    { name: 'Viet Nam', flagUrl: '/assets/demo/images/flags/vn.svg' },
  ];
}
