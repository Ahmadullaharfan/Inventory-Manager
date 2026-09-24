import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { BasicTableTwoComponent } from '../../shared/components/tables/basic-tables/basic-table-two/basic-table-two.component';
import { BasicTableOneComponent } from '../../shared/components/tables/basic-tables/basic-table-one/basic-table-one.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';

@Component({
  imports: [PageBreadcrumbComponent, BasicTableTwoComponent, ComponentCardComponent],
  selector: 'app-user',
  styleUrl: './user.component.css',
  templateUrl: './user.component.html',
})
export class UserComponent {

  tableColumns = [
    { key: 'id', label: 'Deal ID' },
    { key: 'user', label: 'Customer' },
    { key: 'product', label: 'Product/Service' },
    { key: 'price', label: 'Deal Value' },
    { key: 'purchaseDate', label: 'Close Date' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Action' }
  ];

   tableRowData = [
    {
      id: 'DE124321',
      user: { initials: 'AB', name: 'John Doe', email: 'johndoe@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'Software License', price: '$18,50.34', purchaseDate: '2024-06-15' },
      status: { type: 'Complete' },
      actions: { delete: true },
    },
    {
      id: 'DE124322',
      user: { initials: 'CD', name: 'Jane Smith', email: 'janesmith@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'Cloud Hosting', price: '$12,99.00', purchaseDate: '2024-06-18' },
      status: { type: 'Pending' },
      actions: { delete: true },
    },
    {
      id: 'DE124323',
      user: { initials: 'EF', name: 'Michael Brown', email: 'michaelbrown@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'Web Domain', price: '$9,50.00', purchaseDate: '2024-06-20' },
      status: { type: 'Cancel' },
      actions: { delete: true },
    },
    {
      id: 'DE124324',
      user: { initials: 'GH', name: 'Alice Johnson', email: 'alicejohnson@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'SSL Certificate', price: '$2,30.45', purchaseDate: '2024-06-25' },
      status: { type: 'Pending' },
      actions: { delete: true },
    },
    {
      id: 'DE124325',
      user: { initials: 'IJ', name: 'Robert Lee', email: 'robertlee@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'Premium Support', price: '$15,20.00', purchaseDate: '2024-06-30' },
      status: { type: 'Complete' },
      actions: { delete: true },
    },
  ];
}
